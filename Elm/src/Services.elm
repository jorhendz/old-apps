module Services exposing (main)

import Browser
import CategorizationModels exposing (ServiceCategory)
import Debug
import Html exposing (Html, a, br, button, div, hr, input, li, p, text, ul)
import Html.Attributes exposing (attribute, checked, class, href, id, style, type_, value)
import Html.Events exposing (onClick, onInput)
import Http
import Json.Decode as Decode exposing (bool, field, int, string)
import Json.Encode as Encode
import List exposing (sortBy)
import List.Extra


main : Program Int Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Index =
    Int


type PriceType
    = Free
    | HourlyPriced
    | DailyPriced


type Model
    = Success
        { categories : List ServiceCategory
        , providerId : Int
        , services : List Service
        }
    | Failure String


type Price
    = PriceKnown
        { priceValue : Int
        , priceType : PriceType
        }
    | PriceUnknown


type alias Service =
    { category : Maybe ServiceCategory
    , price : Price
    , online : Bool
    , transport_included : Bool
    , administration_included : Bool
    , for_parents : Bool
    }


type Msg
    = GotServiceCategories (Result Http.Error (List ServiceCategory))
    | GotServices (Result Http.Error (List BackendServiceObject))
    | AddEmptyService
    | RemoveServiceByIndex Int
    | SetPrice Index Price
    | SetOnlineValue Index Bool
    | SetTransportValue Index Bool
    | SetAdministrationValue Index Bool
    | SetForParentsValue Index Bool
    | SetCategory Index ServiceCategory
    | Save
    | GotResult (Result Http.Error String)


fail : String -> ( Model, Cmd Msg )
fail errorMessage =
    ( Failure errorMessage, Cmd.none )


init : Int -> ( Model, Cmd Msg )
init providerId =
    ( Success
        { providerId = providerId
        , categories = [ { name = "Test 1", id = 1 }, { name = "Test 2", id = 2 } ]
        , services = [ serviceInit, serviceInit ]
        }
    , Cmd.batch [ getServiceCategories, getServices ]
    )


serviceIsFree : Service -> Bool
serviceIsFree service =
    case service.price of
        PriceKnown r ->
            r.priceType == Free

        PriceUnknown ->
            False


viewService : Index -> List ServiceCategory -> Service -> Html Msg
viewService index services service =
    div [ class "row", style "margin-bottom" "3em" ] <|
        [ div [ class "btn" ] <| serviceCategoryDropdown index services service.category
        , viewPrice index service.price
        , div []
            [ input
                [ type_ "checkbox"
                , checked service.online
                , style "margin-top" "0.5em"
                , style "margin-right" "0.5em"
                , onClick <| SetOnlineValue index <| not service.online
                , style "border-color" primaryDarkColor
                ]
                []
            , text "Indsatsen tilbydes online"
            ]
        ]
            -- Trying to avoid people saying admin or transport is free even if the entire service is free
            -- Technically they can get to a state where they set a free service to have admin by
            -- first making the service payable by the hour, then making it have admin included and
            -- then changing back to the service being free. I haven't been paid enough to clean that up and
            -- it is currently not a problem, as this just implimented for data gathering
            -- Mikkel B. Goldschmidt
            ++ (if serviceIsFree service then
                    []

                else
                    [ div []
                        [ input
                            [ type_ "checkbox"
                            , checked service.administration_included
                            , style "margin-top" "0.5em"
                            , style "margin-right" "0.5em"
                            , onClick <| SetAdministrationValue index <| not service.administration_included
                            , style "border-color" primaryDarkColor
                            ]
                            []
                        , text "Administration inkluderet i prisen"
                        ]
                    , div []
                        [ input
                            [ type_ "checkbox"
                            , checked service.transport_included
                            , style "margin-top" "0.5em"
                            , style "margin-right" "0.5em"
                            , onClick <| SetTransportValue index <| not service.transport_included
                            , style "border-color" primaryDarkColor
                            ]
                            []
                        , text "Transport inkluderet i prisen"
                        ]
                    ]
               )
            ++ [ div []
                    [ input
                        [ type_ "checkbox"
                        , checked service.for_parents
                        , style "margin-top" "0.5em"
                        , style "margin-right" "0.5em"
                        , onClick <| SetForParentsValue index <| not service.for_parents
                        , style "border-color" primaryDarkColor
                        ]
                        []
                    , text "Indsatsen er rettet mod forældre"
                    ]
               , div []
                    [ button
                        [ class "btn"
                        , style "width" "100%"
                        , style "margin-top" "0.5em"
                        , onClick <| RemoveServiceByIndex index
                        , style "border-color" primaryDarkColor
                        ]
                        [ text "Slet indsats" ]
                    ]
               ]


priceHourly : Int -> Price
priceHourly n =
    PriceKnown
        { priceValue = n
        , priceType = HourlyPriced
        }


priceDaily : Int -> Price
priceDaily n =
    PriceKnown
        { priceValue = n, priceType = DailyPriced }


priceFree : Price
priceFree =
    PriceKnown
        { priceValue = 0, priceType = Free }


priceDropdown : Index -> Price -> Html Msg
priceDropdown index selectedPrice =
    let
        currentPriceInt =
            case selectedPrice of
                PriceUnknown ->
                    Nothing

                PriceKnown r ->
                    Just r.priceValue

        currentPriceType =
            case selectedPrice of
                PriceUnknown ->
                    "Pris ikke oplyst"

                PriceKnown r ->
                    case r.priceType of
                        HourlyPriced ->
                            "Timepris"

                        DailyPriced ->
                            "Dagspris"

                        Free ->
                            "Gratis"

        options =
            [ { name = "Gratis", value = priceFree } --{ name = "Pris ikke oplyst", value = PriceUnknown }
            , { name = "Timepris", value = priceHourly <| Maybe.withDefault 0 currentPriceInt }
            , { name = "Dagspris", value = priceDaily <| Maybe.withDefault 0 currentPriceInt }
            ]

        showOption option =
            li []
                [ a [ class "dropdown-item", href "#", onClick <| SetPrice index option.value ]
                    [ text option.name ]
                ]
    in
    dropdown "choose" currentPriceType (List.map showOption options)


viewPrice : Index -> Price -> Html Msg
viewPrice index price =
    let
        setPriceMsg inputValue =
            if inputValue == "" then
                price

            else
                case String.toInt inputValue of
                    Just n ->
                        case price of
                            PriceKnown r ->
                                case r.priceType of
                                    HourlyPriced ->
                                        priceHourly n

                                    DailyPriced ->
                                        priceDaily n

                                    Free ->
                                        priceFree

                            PriceUnknown ->
                                PriceUnknown

                    Nothing ->
                        price
    in
    case price of
        PriceUnknown ->
            priceDropdown index price

        PriceKnown r ->
            case r.priceType of
                DailyPriced ->
                    div []
                        [ priceDropdown index price
                        , input
                            [ onInput <| \s -> SetPrice index (setPriceMsg s)
                            , value <| String.fromInt r.priceValue
                            , style "margin-right" "0.5em"
                            , style "margin-bottom" "0.5em"
                            ]
                            []
                        , text "/ dag"
                        ]

                HourlyPriced ->
                    div []
                        [ priceDropdown index price
                        , input
                            [ onInput <| \s -> SetPrice index (setPriceMsg s)
                            , value <| String.fromInt r.priceValue
                            , style "margin-right" "0.5em"
                            , style "margin-bottom" "0.5em"
                            ]
                            []
                        , text "/ time"
                        ]

                Free ->
                    div []
                        [ priceDropdown index price
                        ]


viewServiceCategoryOption : Index -> ServiceCategory -> Html Msg
viewServiceCategoryOption i sc =
    li []
        [ a [ class "dropdown-item", href "#", onClick <| SetCategory i sc ]
            [ text sc.name ]
        ]


serviceCategoryDropdown : Index -> List ServiceCategory -> Maybe ServiceCategory -> List (Html Msg)
serviceCategoryDropdown index categories selectedCategory =
    [ case selectedCategory of
        Nothing ->
            dropdown "Vælg..." "Vælg..." (List.map (viewServiceCategoryOption index) (List.sortBy .name categories))

        -- Filtering the chosen service category out of the list and sorting alphabetically.
        Just sc ->
            dropdownSelected "Indsatser" sc.name (List.map (viewServiceCategoryOption index) (List.sortBy .name <| List.filter (\cat -> cat.name /= sc.name) categories))
    ]


primaryColor : String
primaryColor =
    "rgb(155, 214, 202)"


primaryDarkColor : String
primaryDarkColor =
    "rgb(33,37,41)"


secondaryColor : String
secondaryColor =
    "rgb(73,105,99)"


contrastColor : String
contrastColor =
    "rgb(202,235,228)"


dropdown_ : Bool -> Bool -> String -> String -> List (Html msg) -> Html msg
dropdown_ hasBackground isSelected id_ title choices =
    div
        [ class "dropdown"
        ]
        [ button
            [ attribute "aria-expanded" "false"
            , class "btn btn-default dropdown-toggle btn-block"
            , style "margin-bottom" "0.75em"
            , style "background-color"
                (if isSelected then
                    if hasBackground then
                        secondaryColor

                    else
                        "#fff"

                 else if hasBackground then
                    primaryColor

                 else
                    "#fff"
                )
            , style "width" "100%"
            , style "color"
                (if isSelected then
                    "#fff"

                 else
                    primaryDarkColor
                )
            , style "overflow" "inital"
            , attribute "data-bs-toggle" "dropdown"
            , id id_
            , if hasBackground then
                style "border-color" "transparent"

              else
                style "border-color" "#B8B8B8"
            , type_ "button"
            ]
            [ text title ]
        , ul
            [ attribute "aria-labelledby" "dropdownMenuButton1"
            , class "dropdown-menu"
            , style "width" "100%"
            , style "overflow" "inital"
            , style "z-index" "2000000"
            , attribute "data-popper-placement" "bottom-start"
            ]
            choices
        ]


dropdownSelected : String -> String -> List (Html msg) -> Html msg
dropdownSelected =
    dropdown_ True True


dropdown : String -> String -> List (Html msg) -> Html msg
dropdown =
    dropdown_ True False


view model =
    case model of
        Failure message ->
            text message

        Success data ->
            Html.div [ class "col" ] <|
                List.indexedMap
                    (\index service -> viewService index data.categories service)
                    data.services
                    ++ [ button
                            [ onClick AddEmptyService
                            , class "btn"
                            , style "width" "45%"
                            , style "background-color" contrastColor
                            ]
                            [ text "Tilføj indsats" ]
                       , button [ class "btn", style "width" "10%" ] [ text "" ]
                       , a
                            [ onClick Save -- BUG: This event is never fired. We redirect before it saves...
                            , class "btn"
                            , style "width" "45%"
                            , style "background-color" contrastColor
                            , style "vertical-align" "left"
                            , href "/profile"
                            , style "appearance" "button"
                            ]
                            [ a
                                [ style "color" primaryDarkColor
                                , style "text-decoration" "none"
                                ]
                                [ text "Gem og tilbage" ]
                            ]
                       ]


serviceInit : Service
serviceInit =
    { category = Nothing
    , price = PriceUnknown
    , online = False
    , administration_included = False
    , transport_included = False
    , for_parents = False
    }


serviceCategoryDecoder =
    Decode.map2 ServiceCategory
        (field "id" int)
        (field "name" string)


getServiceCategories =
    Http.get
        { url = "/api/service-categories"
        , expect = Http.expectJson GotServiceCategories (Decode.list serviceCategoryDecoder)
        }


type alias BackendServiceObject =
    { category : Maybe ServiceCategory
    , priceType : Maybe String
    , priceValue : Maybe Int
    , online : Maybe Bool
    , administration_included : Maybe Bool
    , transport_included : Maybe Bool
    , for_parents : Maybe Bool
    }


serviceDecoder =
    Decode.map7 BackendServiceObject
        (field "category" (Decode.maybe serviceCategoryDecoder))
        (field "price_type" (Decode.maybe string))
        (field "price_value" (Decode.maybe int))
        (field "online" (Decode.maybe bool))
        (field "administration_included" (Decode.maybe bool))
        (field "transport_included" (Decode.maybe bool))
        (field "for_parents" (Decode.maybe bool))


getServices =
    Http.get
        { url = "/api/services"
        , expect = Http.expectJson GotServices (Decode.list serviceDecoder)
        }


submitServices services =
    Http.post
        { url = "/api/set_services"
        , expect = Http.expectJson GotResult string
        , body = Http.jsonBody <| Encode.list encodeService services
        }


encodeService : Service -> Encode.Value
encodeService service =
    case service.category of
        Just category ->
            Encode.object
                ([ ( "id", Encode.int category.id )
                 , ( "online", Encode.bool service.online )
                 , ( "administration_included", Encode.bool service.administration_included )
                 , ( "transport_included", Encode.bool service.transport_included )
                 , ( "for_parents", Encode.bool service.for_parents )
                 ]
                    ++ (case service.price of
                            PriceUnknown ->
                                [ ( "hourly_price", Encode.null ), ( "full_day_price", Encode.null ) ]

                            PriceKnown r ->
                                [ ( "hourly_price"
                                  , if r.priceType == HourlyPriced then
                                        Encode.int r.priceValue

                                    else if r.priceType == Free then
                                        Encode.int 0

                                    else
                                        Encode.null
                                  )
                                , ( "full_day_price"
                                  , if r.priceType == DailyPriced then
                                        Encode.int r.priceValue

                                    else
                                        Encode.null
                                  )
                                ]
                       )
                )

        Nothing ->
            Encode.null


update msg model =
    case model of
        Failure x ->
            fail x

        Success data ->
            case msg of
                GotServiceCategories result ->
                    case result of
                        Err _ ->
                            fail "Failed to fetch service categories"

                        Ok scs ->
                            ( Success { data | categories = scs }, Cmd.none )

                AddEmptyService ->
                    ( Success { data | services = data.services ++ [ serviceInit ] }, Cmd.none )

                RemoveServiceByIndex index ->
                    ( Success { data | services = List.Extra.removeAt index data.services }, Cmd.none )

                SetPrice index newPrice ->
                    let
                        updateService service =
                            { service | price = newPrice }

                        newServices =
                            List.Extra.updateAt index
                                updateService
                                data.services
                    in
                    ( Success
                        { data | services = newServices }
                    , submitServices newServices
                    )

                SetAdministrationValue index newAdministrationValue ->
                    let
                        updateService service =
                            { service | administration_included = newAdministrationValue }

                        newServices =
                            List.Extra.updateAt index
                                updateService
                                data.services
                    in
                    ( Success
                        { data | services = newServices }
                    , submitServices newServices
                    )

                SetTransportValue index newTransportValue ->
                    let
                        updateService service =
                            { service | transport_included = newTransportValue }

                        newServices =
                            List.Extra.updateAt index
                                updateService
                                data.services
                    in
                    ( Success
                        { data | services = newServices }
                    , submitServices newServices
                    )

                SetOnlineValue index newOnlineValue ->
                    let
                        updateService service =
                            { service | online = newOnlineValue }

                        newServices =
                            List.Extra.updateAt index
                                updateService
                                data.services
                    in
                    ( Success
                        { data | services = newServices }
                    , submitServices newServices
                    )

                SetForParentsValue index newForParentsValue ->
                    let
                        updateService service =
                            { service | for_parents = newForParentsValue }

                        newServices =
                            List.Extra.updateAt index
                                updateService
                                data.services
                    in
                    ( Success
                        { data | services = newServices }
                    , submitServices newServices
                    )

                SetCategory index newCategory ->
                    let
                        updateCategory service =
                            { service | category = Just newCategory }
                    in
                    ( Success
                        { data
                            | services =
                                List.Extra.updateAt index
                                    updateCategory
                                    data.services
                        }
                    , submitServices data.services
                    )

                Save ->
                    ( model, submitServices data.services )

                GotResult _ ->
                    ( model, Cmd.none )

                GotServices result ->
                    case result of
                        Err _ ->
                            fail "Failed to fetch current services"

                        Ok serviceObjects ->
                            ( Success { data | services = List.map decodeBackendServiceObject serviceObjects }, Cmd.none )


decodeBackendServiceObject : BackendServiceObject -> Service
decodeBackendServiceObject bso =
    let
        value =
            case bso.priceValue of
                Just n ->
                    n

                Nothing ->
                    0

        price =
            case bso.priceType of
                Just "HOURLY" ->
                    priceHourly value

                Just "DAILY" ->
                    priceDaily value

                Just "FREE" ->
                    priceFree

                Just _ ->
                    priceFree

                Nothing ->
                    PriceUnknown
    in
    { category = bso.category
    , price = price
    , administration_included = Maybe.withDefault False bso.administration_included
    , online = Maybe.withDefault False bso.online
    , transport_included = Maybe.withDefault False bso.transport_included
    , for_parents = Maybe.withDefault False bso.for_parents
    }


subscriptions _ =
    Sub.none
