module Search exposing (main)

import Browser
import Browser.Navigation exposing (load)
import CategorizationModels
    exposing
        ( Area
        , CategorizationModels
        , Creditation
        , Language
        , PostalCode
        , Region
        , ServiceCategory
        , Theme
        , ThemeType(..)
        )
import Html
    exposing
        ( Attribute
        , Html
        , a
        , b
        , br
        , button
        , div
        , i
        , img
        , input
        , label
        , li
        , p
        , span
        , table
        , tbody
        , td
        , text
        , th
        , thead
        , tr
        , ul
        )
import Html.Attributes
    exposing
        ( attribute
        , checked
        , class
        , href
        , id
        , rel
        , src
        , style
        , target
        , type_
        , value
        )
import Html.Events exposing (keyCode, on, onClick, onFocus)
import Http
import Json.Decode as Decode exposing (Decoder, bool, field, int, maybe, null, string)
import Json.Decode.Extra as DecodeExtra exposing (andMap)
import List exposing (sortBy)
import List.Extra exposing (removeAt)
import LocationPicker exposing (Location(..))
import Prelude.Maybe exposing (catMaybes, mapMaybe)
import Url.Builder


main : Program String Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL
--- Provider


type alias Provider =
    { id : Int
    , name : String
    , contactName : Maybe String
    , contactPhone : Maybe String
    , price : Maybe String
    , contactPostalCode : Maybe Int
    , isOnline : Bool
    , isTransportIncluded : Bool
    , isAdministrationIncluded : Bool
    , isForParents : Bool
    , isInternal : Bool
    , membership : Int
    }


providerDecoder : Decoder Provider
providerDecoder =
    Decode.succeed Provider
        |> andMap (field "id" int)
        |> andMap (field "name" string)
        |> andMap (field "contact_name" (maybe string))
        |> andMap (field "contact_phone" (maybe string))
        |> andMap (field "price_string" (maybe string))
        |> andMap (field "contact_postal_code" (maybe int))
        |> andMap (field "is_online" bool)
        |> andMap (field "is_transport_included" bool)
        |> andMap (field "is_administration_included" bool)
        |> andMap (field "is_for_parents" bool)
        |> andMap (field "is_internal" bool)
        |> andMap (field "membership" int)


type Label
    = RegionLabel Region
    | LanguageLabel Language
    | ServiceCategoryLabel ServiceCategory
    | WaitingTimeLabel
    | ThemeLabel Theme
    | InternalLabel
    | FreeLabel
    | GenderLabel Gender
    | AgeLabel Int
    | LocationLabel Location
    | FreeTextLabel String
    | CreditationLabel Creditation


type Sorting
    = SortNameAsc
    | SortNameDesc
    | SortPostalCodeAsc
    | SortPostalCodeDesc
    | SortPrice


type State
    = Loading
    | Loaded (List Provider)
    | LoadingAnotherPage (List Provider)


type Model
    = Page
        { categorizations : CategorizationModels
        , labels : List Label
        , state : State
        , sorting : Maybe Sorting
        , freeTextQuery : String
        , locationPicker : LocationPicker.Model
        , loadedPage : Int
        }
    | Failure


type Gender
    = Boys
    | Girls


type alias Age =
    Int


type alias Query =
    { themes : List Theme
    , serviceCategory : Maybe ServiceCategory
    , noWaitingTime : Bool
    , gender : Maybe Gender
    , locations : List Location
    , internal : Bool
    , free : Bool
    , languages : List Language
    , freeText : String
    , page : Int
    , creditations : List Creditation
    }


getPostalCodeFromLocation : Location -> Maybe PostalCode
getPostalCodeFromLocation location =
    case location of
        LocationPostalCode pc ->
            Just pc

        _ ->
            Nothing


getAreaFromLocation : Location -> Maybe Area
getAreaFromLocation location =
    case location of
        LocationArea area ->
            Just area

        _ ->
            Nothing


queryUrl : Query -> String
queryUrl query =
    let
        areas =
            mapMaybe getAreaFromLocation query.locations

        postalCodes =
            mapMaybe getPostalCodeFromLocation query.locations
    in
    Url.Builder.absolute [ "api", "providers" ] <|
        []
            ++ List.map (\t -> Url.Builder.int "theme_ids" t.id) query.themes
            ++ List.map (\l -> Url.Builder.int "language_ids" l.id) query.languages
            ++ List.map (\l -> Url.Builder.int "area_ids" l.id) areas
            ++ List.map (\c -> Url.Builder.int "creditation_ids" c.id) query.creditations
            ++ List.map (\l -> Url.Builder.int "postal_code_ids" l.id) postalCodes
            ++ (if query.noWaitingTime then
                    [ Url.Builder.string "misc" "NOWAITING" ]

                else
                    []
               )
            ++ (if query.free then
                    [ Url.Builder.string "misc" "VOLUNTEER" ]

                else
                    []
               )
            --++ List.map (\p -> Url.Builder.int "postal_codes" p.id) query.postalCodes
            ++ (if query.internal then
                    [ Url.Builder.string "misc" "INTERNAL" ]

                else
                    []
               )
            ++ (if not (query.freeText == "") then
                    [ Url.Builder.string "freetext" query.freeText ]

                else
                    []
               )
            ++ (Maybe.withDefault []
                    (Maybe.map
                        (\g ->
                            [ Url.Builder.string "gender" <|
                                if g == Boys then
                                    "BOYS"

                                else
                                    "GIRLS"
                            ]
                        )
                        query.gender
                    )
                    ++ catMaybes
                        [ Maybe.map
                            (\sc -> Url.Builder.int "service_category_id" sc.id)
                            query.serviceCategory
                        ]
               )
            ++ [ Url.Builder.int "page" query.page ]


getThemeFromLabel : Label -> Maybe Theme
getThemeFromLabel label =
    case label of
        ThemeLabel theme ->
            Just theme

        _ ->
            Nothing


getServiceCategoryFromLabel : Label -> Maybe ServiceCategory
getServiceCategoryFromLabel label =
    case label of
        ServiceCategoryLabel sc ->
            Just sc

        _ ->
            Nothing


getServiceCategoryFromLabels : List Label -> Maybe ServiceCategory
getServiceCategoryFromLabels labels =
    let
        categories =
            mapMaybe getServiceCategoryFromLabel labels
    in
    List.head categories


getGenderFromLabel : Label -> Maybe Gender
getGenderFromLabel label =
    case label of
        GenderLabel g ->
            Just g

        _ ->
            Nothing


getGenderFromLabels : List Label -> Maybe Gender
getGenderFromLabels labels =
    let
        genders =
            mapMaybe getGenderFromLabel labels
    in
    List.head genders


getLocationFromLabel : Label -> Maybe Location
getLocationFromLabel label =
    case label of
        LocationLabel loc ->
            Just loc

        _ ->
            Nothing


getLocationsFromLabels : List Label -> List Location
getLocationsFromLabels labels =
    mapMaybe getLocationFromLabel labels


getLanguageFromLabel : Label -> Maybe Language
getLanguageFromLabel label =
    case label of
        LanguageLabel lang ->
            Just lang

        _ ->
            Nothing


getCreditationFromLabel : Label -> Maybe Creditation
getCreditationFromLabel label =
    case label of
        CreditationLabel cred ->
            Just cred

        _ ->
            Nothing


generateQuery : Int -> List Label -> Query
generateQuery page labels =
    let
        themes =
            mapMaybe getThemeFromLabel labels
    in
    { themes = themes
    , serviceCategory = getServiceCategoryFromLabels labels
    , noWaitingTime = List.member WaitingTimeLabel labels
    , gender = getGenderFromLabels labels
    , internal = List.member InternalLabel labels
    , free = List.member FreeLabel labels
    , languages = mapMaybe getLanguageFromLabel labels
    , locations = getLocationsFromLabels labels
    , freeText =
        Maybe.withDefault "" <|
            Maybe.andThen getFreeTextFromLabel (List.head (List.filter isFreeTextLabel labels))
    , page = page
    , creditations = mapMaybe getCreditationFromLabel labels
    }


emptyQuery : Query
emptyQuery =
    generateQuery 0 []


init : String -> ( Model, Cmd Msg )
init freeTextQuery =
    let
        initialLabels =
            case freeTextQuery of
                "" ->
                    []

                s ->
                    [ FreeTextLabel s ]
    in
    ( Page
        { categorizations =
            CategorizationModels.emptyCategorizationModels
        , labels = initialLabels
        , sorting = Nothing
        , state = Loading
        , locationPicker =
            Tuple.first <|
                LocationPicker.init []
        , freeTextQuery = ""
        , loadedPage = 0
        }
    , Cmd.batch
        [ Cmd.map CategorizationModelsMsg
            CategorizationModels.getCategorizationModels
        , getProviders (generateQuery 0 initialLabels)
        ]
    )



-- UPDATE


type Msg
    = GotProviders Int (Result Http.Error (List Provider))
    | AddLabel Label
    | RemoveLabel Int
    | RemoveSameLabel Label
    | ResetPage
    | CategorizationModelsMsg CategorizationModels.Msg
    | LocationPickerMsg LocationPicker.Msg
    | UpdateFreeTextQuery String
    | Sort (Maybe Sorting)
    | LoadMoreProviders


getProviders : Query -> Cmd Msg
getProviders query =
    let
        msg =
            GotProviders query.page
    in
    Http.get
        { url = queryUrl query
        , expect = Http.expectJson msg (Decode.list providerDecoder)
        }


isServiceCategoryLabel : Label -> Bool
isServiceCategoryLabel label =
    case label of
        ServiceCategoryLabel _ ->
            True

        _ ->
            False


isFreeTextLabel : Label -> Bool
isFreeTextLabel label =
    case label of
        FreeTextLabel _ ->
            True

        _ ->
            False


getFreeTextFromLabel : Label -> Maybe String
getFreeTextFromLabel label =
    case label of
        FreeTextLabel s ->
            Just s

        _ ->
            Nothing


uniqueIdentifier : Label -> String
uniqueIdentifier label =
    case label of
        ThemeLabel theme ->
            "theme-" ++ String.fromInt theme.id

        LanguageLabel lang ->
            "lang-" ++ String.fromInt lang.id

        CreditationLabel cred ->
            "cred-" ++ String.fromInt cred.id

        ServiceCategoryLabel sc ->
            "sc-" ++ String.fromInt sc.id

        WaitingTimeLabel ->
            "nowait"

        InternalLabel ->
            "internal"

        FreeLabel ->
            "free"

        AgeLabel age ->
            "age" ++ String.fromInt age

        GenderLabel g ->
            case g of
                Boys ->
                    "gender-boys"

                Girls ->
                    "gender-girls"

        RegionLabel r ->
            "region-" ++ String.fromInt r.id

        LocationLabel loc ->
            case loc of
                LocationPostalCode pc ->
                    String.fromInt pc.number ++ " - " ++ pc.name

                LocationArea area ->
                    area.name

        FreeTextLabel s ->
            "freetext-" ++ s


labelsEqual : Label -> Label -> Bool
labelsEqual labelA labelB =
    uniqueIdentifier labelA == uniqueIdentifier labelB


isGenderLabel : Label -> Bool
isGenderLabel label =
    case label of
        GenderLabel _ ->
            True

        _ ->
            False


isAgeLabel : Label -> Bool
isAgeLabel label =
    case label of
        AgeLabel _ ->
            True

        _ ->
            False


reviseLabels : Label -> List Label -> List Label
reviseLabels newLabel allLabels =
    let
        labels =
            List.filter (labelsEqual newLabel >> not) allLabels
    in
    case newLabel of
        ServiceCategoryLabel _ ->
            List.filter (isServiceCategoryLabel >> not) labels ++ [ newLabel ]

        GenderLabel _ ->
            List.filter (isGenderLabel >> not) labels ++ [ newLabel ]

        AgeLabel _ ->
            List.filter (isAgeLabel >> not) labels ++ [ newLabel ]

        FreeTextLabel _ ->
            List.filter (isFreeTextLabel >> not) labels ++ [ newLabel ]

        _ ->
            labels ++ [ newLabel ]


currentProviders : State -> List Provider
currentProviders state =
    case state of
        Loading ->
            []

        Loaded providers ->
            providers

        LoadingAnotherPage providers ->
            providers


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Page data ->
            case msg of
                GotProviders page result ->
                    case result of
                        Ok providers ->
                            case page of
                                0 ->
                                    ( Page { data | state = Loaded providers, loadedPage = page }, Cmd.none )

                                _ ->
                                    ( Page { data | state = Loaded (currentProviders data.state ++ providers), loadedPage = page }, Cmd.none )

                        Err _ ->
                            ( Failure, Cmd.none )

                Sort maybeSorting ->
                    case maybeSorting of
                        Just SortNameAsc ->
                            ( Page { data | state = Loaded (List.sortBy .name (currentProviders data.state)), sorting = Just SortNameAsc }
                            , Cmd.none
                            )

                        Just SortNameDesc ->
                            ( Page { data | state = Loaded (List.reverse <| List.sortBy .name (currentProviders data.state)), sorting = Just SortNameDesc }
                            , Cmd.none
                            )

                        Just SortPostalCodeAsc ->
                            ( Page { data | state = Loaded (List.sortWith sortByPostalCode (currentProviders data.state)), sorting = Just SortPostalCodeAsc }
                            , Cmd.none
                            )

                        Just SortPostalCodeDesc ->
                            ( Page { data | state = Loaded (List.reverse <| List.sortWith sortByPostalCode (currentProviders data.state)), sorting = Just SortPostalCodeDesc }
                            , Cmd.none
                            )

                        Just SortPrice ->
                            ( Page { data | state = Loaded (List.sortWith sortByPrice (currentProviders data.state)), sorting = Just SortPrice }
                            , Cmd.none
                            )

                        Nothing ->
                            let
                                newLabels =
                                    []
                            in
                            ( Page { data | state = Loading, sorting = Nothing }
                            , getProviders (generateQuery 0 newLabels)
                            )

                AddLabel label ->
                    let
                        newLabels =
                            reviseLabels label data.labels
                    in
                    ( Page
                        { data
                            | state = Loading
                            , labels = newLabels
                            , sorting = Nothing
                            , freeTextQuery =
                                if isFreeTextLabel label then
                                    ""

                                else
                                    data.freeTextQuery
                        }
                    , getProviders (generateQuery 0 newLabels)
                    )

                RemoveLabel index ->
                    let
                        newLabels =
                            removeAt index data.labels
                    in
                    ( Page { data | state = Loading, labels = newLabels, sorting = Nothing }
                    , getProviders (generateQuery 0 newLabels)
                    )

                RemoveSameLabel label ->
                    let
                        newLabels =
                            List.filter (labelsEqual label >> not) data.labels
                    in
                    ( Page { data | state = Loading, labels = newLabels, sorting = Nothing }
                    , getProviders (generateQuery 0 newLabels)
                    )

                ResetPage ->
                    let
                        newLabels =
                            []
                    in
                    ( Page { data | state = Loading, labels = newLabels, sorting = Nothing }
                    , getProviders (generateQuery 0 newLabels)
                    )

                CategorizationModelsMsg innerMsg ->
                    let
                        result =
                            CategorizationModels.update innerMsg data.categorizations
                    in
                    case result of
                        Ok newCats ->
                            ( Page
                                { data
                                    | categorizations = newCats
                                    , locationPicker =
                                        Tuple.first <|
                                            LocationPicker.init
                                                (LocationPicker.locationList newCats.postalCodes newCats.areas)
                                }
                            , Cmd.none
                            )

                        Err _ ->
                            ( Failure, Cmd.none )

                LocationPickerMsg innerMsg ->
                    let
                        updated =
                            LocationPicker.update innerMsg data.locationPicker
                    in
                    case updated.chosenLocation of
                        Nothing ->
                            ( Page
                                { data
                                    | locationPicker = updated.model
                                }
                            , updated |> .cmd |> Cmd.map LocationPickerMsg
                            )

                        Just location ->
                            let
                                newLabels =
                                    reviseLabels (LocationLabel location)
                                        data.labels
                            in
                            ( Page
                                { data
                                    | locationPicker = updated.model
                                    , labels = newLabels
                                }
                            , Cmd.batch
                                [ updated |> .cmd |> Cmd.map LocationPickerMsg
                                , getProviders (generateQuery 0 newLabels)
                                ]
                            )

                UpdateFreeTextQuery q ->
                    ( Page { data | freeTextQuery = q }, Cmd.none )

                LoadMoreProviders ->
                    case data.state of
                        Loaded providers ->
                            ( Page { data | state = LoadingAnotherPage providers, sorting = Nothing }
                            , getProviders (generateQuery (data.loadedPage + 1) data.labels)
                            )

                        _ ->
                            ( Page data, Cmd.none )

        Failure ->
            ( Failure, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    case model of
        Failure ->
            text "Failed"

        Page modelData ->
            searchForm
                modelData.categorizations
                modelData.sorting
                modelData.state
                modelData.labels
                modelData.freeTextQuery
                modelData.locationPicker


viewServiceCategoryChoice : ServiceCategory -> Html Msg
viewServiceCategoryChoice sc =
    li []
        [ a [ class "dropdown-item gaFilterBySC", href "#", onClick <| AddLabel (ServiceCategoryLabel sc) ]
            [ text sc.name ]
        ]


viewLanguageChoice : Language -> Html Msg
viewLanguageChoice lang =
    li []
        [ a [ class "dropdown-item gaFilterByLanguage", href "#", onClick <| AddLabel (LanguageLabel lang) ]
            [ text lang.name ]
        ]


viewCreditationsChoice : Creditation -> Html Msg
viewCreditationsChoice cred =
    li []
        [ a [ class "dropdown-item gaFilterByCred", href "#", onClick <| AddLabel (CreditationLabel cred) ]
            [ text cred.name ]
        ]


sortingTitle : Maybe Sorting -> String
sortingTitle maybeSorting =
    case maybeSorting of
        Nothing ->
            "Ingen sortering"

        Just sorting ->
            case sorting of
                SortNameAsc ->
                    "Navn (A-Å)"

                SortNameDesc ->
                    "Navn (Å-A)"

                SortPostalCodeAsc ->
                    "Postnr (lav-høj)"

                SortPostalCodeDesc ->
                    "Postnr (høj-lav)"

                SortPrice ->
                    "Pris (lav-høj)"


viewSortingChoice : Maybe Sorting -> Html Msg
viewSortingChoice maybeSorting =
    li []
        [ a [ class "dropdown-item gaFilterBySorting", href "#", onClick <| Sort maybeSorting ]
            [ text (sortingTitle maybeSorting) ]
        ]


viewGenderChoice : Gender -> Html Msg
viewGenderChoice gen =
    li []
        [ a [ class "dropdown-item gaFilterByGender", href "#", onClick <| AddLabel (GenderLabel gen) ]
            [ case gen of
                Boys ->
                    text "Kun for drenge"

                Girls ->
                    text "Kun for piger"
            ]
        ]


viewAgeChoice : Age -> Html Msg
viewAgeChoice age =
    li []
        [ a [ class "dropdown-item gaFilterByAge", href "#", onClick <| AddLabel (AgeLabel age) ]
            [ text <| String.fromInt age
            ]
        ]


viewThemeChoice : Theme -> Html Msg
viewThemeChoice theme =
    li []
        [ a
            [ class <| ("dropdown-item" ++ " gaFilterBy" ++ gaNamify (themeTypeName theme.theme_type))
            , href "#"
            , onClick <| AddLabel (ThemeLabel theme)
            ]
            [ text theme.name ]
        ]


themeTypeName : ThemeType -> String
themeTypeName tt =
    case tt of
        SocialType ->
            "Sociale"

        PhysicalType ->
            "Fysiske"

        MentalType ->
            "Psykiske"


viewThemeDropdown : List Theme -> ThemeType -> Html Msg
viewThemeDropdown themes themeType =
    dropdown ("choose" ++ themeTypeName themeType)
        (themeTypeName themeType)
    <|
        List.map viewThemeChoice (List.sortBy .name <| List.filter (\t -> t.theme_type == themeType) themes)


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


yellow : String
yellow =
    "rgb(255,247,173)"



-- Normal dropdown


dropdown_ : Bool -> Bool -> String -> String -> List (Html msg) -> Html msg
dropdown_ hasBackground isSelected id_ title choices =
    div
        [ class "dropdown"
        ]
        [ button
            [ attribute "aria-expanded" "false"
            , class "btn btn-default dropdown-toggle btn-block"
            , style "margin-bottom" "0.75em"
            , style "text-align" "left"
            , style "color"
                (if isSelected then
                    "#fff"

                 else
                    ""
                )
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



-- Broad dropdown


broad_dropdown_ : Bool -> Bool -> String -> String -> List (Html msg) -> Html msg
broad_dropdown_ hasBackground isSelected id_ title choices =
    div
        [ class "dropdown"
        ]
        [ button
            [ attribute "aria-expanded" "false"
            , class "btn btn-default dropdown-toggle btn-block"
            , style "margin-bottom" "0.75em"
            , style "text-align" "left"
            , style "color"
                (if isSelected then
                    "#fff"

                 else
                    ""
                )
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
            , style "width" "auto%"
            , style "overflow" "inital"
            , style "z-index" "2000000"
            , attribute "data-popper-placement" "bottom-start"
            ]
            choices
        ]


broad_dropdownSelected : String -> String -> List (Html msg) -> Html msg
broad_dropdownSelected =
    broad_dropdown_ True True


broad_dropdown : String -> String -> List (Html msg) -> Html msg
broad_dropdown =
    broad_dropdown_ True False


labelName : Label -> String
labelName label =
    case label of
        ServiceCategoryLabel sc ->
            sc.name

        RegionLabel r ->
            r.name

        LanguageLabel l ->
            l.name

        WaitingTimeLabel ->
            "Uden ventetid"

        ThemeLabel t ->
            t.name

        FreeLabel ->
            "Frivilligt tilbud"

        InternalLabel ->
            "Internt tilbud"

        GenderLabel Boys ->
            "Tilbud kun til drenge"

        GenderLabel Girls ->
            "Tilbud kun til piger"

        AgeLabel age ->
            String.fromInt age ++ " år"

        LocationLabel loc ->
            case loc of
                LocationPostalCode pc ->
                    String.fromInt pc.number ++ " - " ++ pc.name

                LocationArea area ->
                    area.name

        FreeTextLabel text ->
            "Navn indeholder: " ++ text

        CreditationLabel c ->
            c.name


viewLabel : Int -> Label -> Html Msg
viewLabel index label =
    div
        [ class "badge"
        , attribute "style" "margin: 0.25em"
        , style "background-color" secondaryColor
        ]
        [ span []
            [ text <| labelName label ]
        , button
            [ class "btn-close"
            , onClick (RemoveLabel index)
            , type_ "button"
            ]
            []
        ]


serviceCategoryDropdown : List ServiceCategory -> Maybe ServiceCategory -> List (Html Msg)
serviceCategoryDropdown categories selectedCategory =
    [ case selectedCategory of
        Nothing ->
            dropdown "Indsats" "Indsats" (List.map viewServiceCategoryChoice (sortBy .name categories))

        Just sc ->
            dropdownSelected "Indsats" sc.name (List.map viewServiceCategoryChoice (sortBy .name categories))
    ]


checkbox : String -> (Bool -> Msg) -> Bool -> Html Msg
checkbox title msgFunc isChecked =
    div
        [ class "mb-3 "
        , style "border" "0"
        ]
        [ div
            [ class "form-check"
            , onClick <| msgFunc isChecked
            , style "margin-left" "1.75em"
            , style "margin-top" "-0.18em"
            , style "margin-bottom" "-0.18em"
            ]
            [ input
                ([ class <| ("form-check-input" ++ " gaFilterBy" ++ title)
                 , type_ "checkbox"
                 , checked isChecked
                 ]
                    ++ (if isChecked then
                            [ style "background-color" secondaryColor
                            , style "border" "0"
                            ]

                        else
                            []
                       )
                )
                []
            , label
                [ class "form-check-label"
                ]
                [ text title ]
            ]
        ]


borderedCheckbox : String -> (Bool -> Msg) -> Bool -> Html Msg
borderedCheckbox title msgFunc isChecked =
    div
        [ class "card "
        , style "margin-bottom" "0.85rem"
        , style "margin-top" "0em"
        , style "padding-top" "0.575rem"
        , style "padding-bottom" "0.575rem"
        , style "background-color" primaryColor
        , style "border" "1.25"
        , style "border-color" "transparent"
        ]
        [ div
            [ class "form-check"
            , onClick <| msgFunc isChecked
            , style "margin-left" "1.75em"
            , style "margin-top" "-0.18em"
            , style "margin-bottom" "-0.18em"
            ]
            [ input
                ([ class <| ("form-check-input" ++ " gaFilterBy" ++ gaNamify title)
                 , type_ "checkbox"
                 , checked isChecked
                 ]
                    ++ (if isChecked then
                            [ style "background-color" secondaryColor
                            , style "border" "0"
                            ]

                        else
                            []
                       )
                )
                []
            , label
                [ class "form-check-label"
                ]
                [ text title ]
            ]
        ]



-- Function gaNamify that helps Google Analytics to check which checkboxes are checked.


gaNamify : String -> String
gaNamify title =
    case title of
        "Internt tilbud" ->
            "Internal"

        "Frivilligt tilbud" ->
            "Volunteer"

        "Uden ventetid" ->
            "NoWaiting"

        "Sociale" ->
            "Social"

        "Fysiske" ->
            "Physical"

        "Psykiske" ->
            "Psychological"

        _ ->
            "Other"


labelCheckboxAction : Label -> (Bool -> Msg)
labelCheckboxAction label check =
    if check then
        RemoveSameLabel label

    else
        AddLabel label


searchBoxTitle : String -> Html Msg
searchBoxTitle title =
    p
        [ style "margin-bottom" "0.45em"
        , style "font-weight" "bold"
        , style "margin-top" "1.35em"
        ]
        [ text title ]


colMembership : String
colMembership =
    "3"


colName : String
colName =
    "39"


colPostalCode : String
colPostalCode =
    "10"


colContactName : String
colContactName =
    "20"


colPrice : String
colPrice =
    "18"


colIcons : String
colIcons =
    "10"



{- There are four info columns -}


searchForm :
    CategorizationModels
    -> Maybe Sorting
    -> State
    -> List Label
    -> String
    -> LocationPicker.Model
    -> Html Msg
searchForm catModels maybeSorting searchState labels query locationPicker =
    let
        serviceCategories =
            catModels.serviceCategories

        themes =
            catModels.themes

        languages =
            catModels.languages

        creditations =
            catModels.creditations
    in
    div [ class "container", attribute "style" "padding-top: 2em;padding-left: 2em;padding-right: 2em; text-align: left;" ]
        [ div [ class "row" ]
            [ div [ class "col-8" ]
                [ div [ class "input-group", style "margin-bottom" "0.75em" ]
                    [ input
                        [ class "form-control"
                        , type_ "text"
                        , Html.Attributes.placeholder "Søg efter tilbudsnavn..."
                        , Html.Events.onInput UpdateFreeTextQuery
                        , value query
                        , onEnter <| AddLabel (FreeTextLabel query)
                        ]
                        []
                    , button
                        [ class "btn btn-default"
                        , style "background-color" primaryColor
                        , Html.Events.onClick <| AddLabel (FreeTextLabel query)
                        ]
                        [ text "Søg" ]
                    ]
                ]
            , div [ class "col" ] []
            ]
        , div [ class "row" ]
            [ div [ class "col-8" ]
                [ searchBoxTitle "Hvilken type hjælp søger du?"
                , div [] <| serviceCategoryDropdown serviceCategories (getServiceCategoryFromLabels labels)
                , searchBoxTitle "Hvor skal hjælpen gives?"
                , div [ class "row", style "padding-bottom" "4em" ]
                    [ Html.map LocationPickerMsg <| LocationPicker.view locationPicker ]
                , searchBoxTitle "Hvad er udfordringen? (Vælg gerne flere)"
                , div [ class "row" ]
                    [ div [ class "col" ] [ viewThemeDropdown themes SocialType ]
                    , div [ class "col" ] [ viewThemeDropdown themes MentalType ]
                    , div [ class "col" ] [ viewThemeDropdown themes PhysicalType ]
                    ]
                ]
            , div [ class "col" ]
                [ searchBoxTitle "Er der andre vigtige kriterier?"
                , div
                    [ class "col"
                    , style "width" "100%"
                    ]
                    [ borderedCheckbox
                        "Uden ventetid"
                        (labelCheckboxAction WaitingTimeLabel)
                        (List.member WaitingTimeLabel labels)
                    ]
                , div [ class "row" ]
                    [ div [ class "col-md-6", style "margin-bottom" "0.1rem" ]
                        [ dropdown "køn" "Køn" <| List.map viewGenderChoice [ Boys, Girls ] ]
                    , div [ class "col-md-6", style "margin-bottom" "0.1rem" ]
                        [ dropdown "alder" "Alder" <| List.map viewAgeChoice (List.range 0 23) ]
                    ]
                , dropdown "sprog" "Sprog" <| List.map viewLanguageChoice languages
                , broad_dropdown "kvalitetsstempel" "Kvalitetstempler" <| List.map viewCreditationsChoice creditations
                , div [ class "row" ]
                    [ searchBoxTitle "Søg kun efter"
                    , div [ class "col", style "margin-top" "0.15em" ]
                        [ borderedCheckbox
                            "Internt tilbud"
                            (labelCheckboxAction InternalLabel)
                            (List.member InternalLabel labels)
                        ]
                    , div [ class "col", style "margin-top" "0.15rem" ]
                        [ borderedCheckbox
                            "Frivilligt tilbud"
                            (labelCheckboxAction FreeLabel)
                            (List.member FreeLabel labels)
                        ]
                    ]
                ]
            ]
        , div [ class "container-fluid", style "padding-left" "0" ]
            [ div [ class "row" ] <|
                if List.isEmpty labels then
                    []

                else
                    [ p
                        [ style "margin-top" "1.5em"
                        , style "margin-bottom" "0.0em"
                        ]
                        [ text "Du har valgt:" ]
                    ]
            , div
                [ class "row"
                ]
                [ div [ class "col-md-10", style "padding-left" "0.5em" ] <| List.indexedMap viewLabel labels
                , div [ class "col-md-2", style "text-align" "right" ]
                    (if List.isEmpty labels then
                        []

                     else
                        [ div [ class "row" ]
                            [ button
                                [ onClick ResetPage
                                , class "btn"
                                , attribute "style" "margin: 0.25em"
                                , style "font-size" "0.75em"
                                , style "padding-top" "0.75em"
                                , style "padding-bottom" "0.75em"
                                , style "text-align" "right"
                                ]
                                [ div [] [ text "Nulstil" ]
                                ]
                            ]
                        ]
                    )
                ]
            , div
                [ class "row"
                , style "margin-bottom" "2em"
                , style "margin-top" "1.5em"
                ]
                [ div [ class "col-md-10" ] []
                , div
                    [ class "col-md-2"
                    , style "text-align" "right"
                    , style "padding-right" "0"
                    , style "padding-left" "1.25em"
                    ]
                    [ case maybeSorting of
                        Nothing ->
                            dropdown "sorting" "Sortér efter" <|
                                List.map viewSortingChoice (Nothing :: List.map Just [ SortNameAsc, SortNameDesc, SortPostalCodeAsc, SortPostalCodeDesc, SortPrice ])

                        Just sorting ->
                            dropdownSelected "sorting" (sortingTitle (Just sorting)) <|
                                List.map viewSortingChoice (Nothing :: List.map Just [ SortNameAsc, SortNameDesc, SortPostalCodeAsc, SortPostalCodeDesc, SortPrice ])
                    ]
                ]
            , div [ class "row", style "padding-left" "0.75em" ] <|
                let
                    tableTitle title =
                        b
                            [ style "margin-left" "0.5em"
                            , style "margin-right" "0.5em"
                            ]
                            [ text title ]

                    faIcon icon =
                        i [ class "fas", class ("fa-" ++ icon) ] []
                in
                case searchState of
                    Loading ->
                        [ text "Loading" ]

                    Loaded providers ->
                        [ table
                            [ class "table table-striped dataTable no-footer"
                            , id "results"
                            ]
                            [ thead []
                                [ tr
                                    [ attribute "role" "row"
                                    , style "background-color" secondaryColor
                                    , style "color" "#fff"
                                    ]
                                    [ th
                                        [ class "th-sm sorting"
                                        , attribute "colspan" "1"
                                        , attribute "rowspan" "1"
                                        , attribute "style" ("width: " ++ colMembership ++ "%;")
                                        , attribute "tabindex" "0"
                                        ]
                                        []
                                    , th
                                        [ attribute "colspan" "1"
                                        , attribute "rowspan" "1"
                                        , attribute "style" ("width: " ++ colName ++ "%;")
                                        , attribute "tabindex" "0"
                                        ]
                                        [ faIcon "building"
                                        , tableTitle "Tilbud"
                                        ]
                                    , th [ attribute "colspan" "1", attribute "rowspan" "1", attribute "style" ("width: " ++ colPostalCode ++ "%;"), attribute "tabindex" "0" ]
                                        [ faIcon "map-marked-alt"
                                        , tableTitle "Postnr."
                                        ]
                                    , th [ class "th-sm sorting", attribute "colspan" "1", attribute "style" ("width: " ++ colContactName ++ "%;"), attribute "tabindex" "0" ]
                                        [ faIcon "user"
                                        , tableTitle "Kontaktperson"
                                        ]
                                    , th [ class "th-sm sorting", attribute "colspan" "1", attribute "style" ("width: " ++ colPrice ++ "%;"), attribute "tabindex" "0" ]
                                        [ faIcon "coins"
                                        , tableTitle "Pris"
                                        ]
                                    , th
                                        [ class "th-sm sorting"
                                        , attribute "colspan" "1"
                                        , attribute "rowspan" "1"
                                        , attribute "style" ("width: " ++ colIcons ++ "%;")
                                        , attribute "tabindex" "0"
                                        ]
                                        []
                                    ]
                                ]
                            , tbody [] <| List.map viewProvider providers
                            ]
                        , div [ style "text-align" "center" ] <|
                            if List.map viewProvider providers == [] then
                                [ text "Der er desværre ingen, der tilbyder det, du søger efter."
                                , br [] []
                                , text "Prøv at lave en bredere søgning for at finde et godt alternativ."
                                , br [] []
                                , text "God fortsat søgning."
                                ]

                            else
                                [ button [ class "bb-center-button", class "btn", onClick LoadMoreProviders ] [ text "Vis flere tilbud" ]
                                ]
                        ]

                    LoadingAnotherPage providers ->
                        [ table [ class "table table-striped dataTable no-footer", id "results" ]
                            [ thead []
                                [ tr [ attribute "role" "row" ]
                                    [ th
                                        [ class "th-sm sorting"
                                        , attribute "colspan" "1"
                                        , attribute "rowspan" "1"
                                        , attribute "style" ("width: " ++ colMembership ++ "%;")
                                        , attribute "tabindex" "0"
                                        ]
                                        []
                                    , th
                                        [ attribute "colspan" "1"
                                        , attribute "rowspan" "1"
                                        , attribute "style" ("width: " ++ colName ++ "%;")
                                        , attribute "tabindex" "0"
                                        ]
                                        [ faIcon "building"
                                        , tableTitle "Tilbud"
                                        ]
                                    , th [ attribute "colspan" "1", attribute "rowspan" "1", attribute "style" ("width: " ++ colPostalCode ++ "%;"), attribute "tabindex" "0" ]
                                        [ faIcon "map-marked-alt"
                                        , tableTitle "Postnr."
                                        ]
                                    , th [ class "th-sm sorting", attribute "colspan" "1", attribute "style" ("width: " ++ colContactName ++ "%;"), attribute "tabindex" "0" ]
                                        [ faIcon "user"
                                        , tableTitle "Kontaktperson"
                                        ]
                                    , th [ class "th-sm sorting", attribute "colspan" "1", attribute "style" ("width: " ++ colPrice ++ "%;"), attribute "tabindex" "0" ]
                                        [ faIcon "coins"
                                        , tableTitle "Pris"
                                        ]
                                    , th
                                        [ class "th-sm sorting"
                                        , attribute "colspan" "1"
                                        , attribute "rowspan" "1"
                                        , attribute "style" ("width: " ++ colIcons ++ "%;")
                                        , attribute "tabindex" "0"
                                        ]
                                        []
                                    ]
                                ]
                            , tbody [] <| List.map viewProvider providers
                            ]
                        , div [ style "text-align" "center" ] <|
                            if List.map viewProvider providers == [] then
                                [ text "Der er desværre ingen, der tilbyder det, du søger efter."
                                , br [] []
                                , text "Prøv at lave en bredere søgning for at finde et godt alternativ."
                                , br [] []
                                , text "God fortsat søgning."
                                ]

                            else
                                []
                        ]
            ]
        ]



-- Membership types


expert : number
expert =
    2


basis : number
basis =
    1



-- Search results


viewProvider : Provider -> Html Msg
viewProvider provider =
    if provider.membership == expert then
        tr
            [ attribute "role" "row"
            , class "fixedheight"
            , style "background-color" primaryColor
            , style "color" "#000"
            ]
            [ td []
                [ div []
                    [ span []
                        [ img
                            [ src "/static/diamond_icon.webp"
                            , attribute "data-bs-toggle"
                                "tooltip"
                            , attribute "trigger"
                                "hover focus click"
                            , attribute
                                "data-bs-placement"
                                "bottom"
                            , attribute "title" "Ekspert"
                            ]
                            []
                        ]
                    ]
                ]
            , td
                []
                [ div []
                    [ a
                        [ style "text-decoration" "none"
                        , style "color" "#000"
                        , href <| "/provider/" ++ String.fromInt provider.id
                        , id <| String.fromInt provider.id
                        , rel "noopener noreferrer"
                        , id "424"
                        , target "_blank"
                        ]
                        [ p []
                            [ b [] [ text provider.name ] ]
                        ]
                    ]
                ]
            , td []
                [ div []
                    [ a
                        [ style "text-decoration" "none"
                        , style "color" "#000"
                        , href <| "/provider/" ++ String.fromInt provider.id
                        , id <| String.fromInt provider.id
                        , rel "noopener noreferrer"
                        , id "424"
                        , target "_blank"
                        ]
                        [ b [] [ text <| ifZero (String.fromInt (Maybe.withDefault 0 provider.contactPostalCode)) ] ]
                    ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ b [] [ text <| Maybe.withDefault "" provider.contactName ] ] ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ b [] [ text <| Maybe.withDefault "Kontakt for pris" provider.price ] ] ]
                ]
            , td []
                [ div []
                    [ span []
                        [ if provider.isOnline then
                            i
                                [ class "fas"
                                , class "fa-globe"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen tilbydes online"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isTransportIncluded then
                            i
                                [ class "fas"
                                , class "fa-car-side"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute "trigger"
                                    "hover focus click"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Kørsel er inkluderet i prisen"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isAdministrationIncluded then
                            i
                                [ class "fas"
                                , class "fa-file-invoice"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Administration er inkluderet i prisen"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isForParents then
                            i
                                [ class "fas"
                                , class "fa-users"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen er rettet mod forældre"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isInternal then
                            i
                                [ class "fas"
                                , class "fa-home"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen er et internt tilbud"
                                ]
                                []

                          else
                            i [] []
                        ]
                    ]
                ]
            ]

    else if provider.membership == basis then
        tr
            [ attribute "role" "row"
            , class "fixedheight"
            , style "background-color" primaryColor
            ]
            [ td []
                [ div []
                    [ span []
                        [ img
                            [ src "/static/star_icon.webp"
                            , attribute "data-bs-toggle"
                                "tooltip"
                            , attribute "trigger"
                                "hover focus click"
                            , attribute
                                "data-bs-placement"
                                "bottom"
                            , attribute "title" "Kørsel er inkluderet i prisen"
                            ]
                            []
                        ]
                    ]
                ]
            , td []
                [ div []
                    [ a
                        [ class "link-dark"
                        , style "text-decoration" "none"
                        , href <| "/provider/" ++ String.fromInt provider.id
                        , id <| String.fromInt provider.id
                        , rel "noopener noreferrer"
                        , id "424"
                        , target "_blank"
                        ]
                        [ p []
                            [ text provider.name ]
                        ]
                    ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ text <| ifZero (String.fromInt (Maybe.withDefault 0 provider.contactPostalCode)) ] ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ text <| Maybe.withDefault "" provider.contactName ] ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ text <| Maybe.withDefault "Kontakt for pris" provider.price ] ]
                ]
            , td []
                [ div []
                    [ span []
                        [ if provider.isOnline then
                            i
                                [ class "fas"
                                , class "fa-globe"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen tilbydes online"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isTransportIncluded then
                            i
                                [ class "fas"
                                , class "fa-car-side"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute "trigger"
                                    "hover focus click"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Kørsel er inkluderet i prisen"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isAdministrationIncluded then
                            i
                                [ class "fas"
                                , class "fa-file-invoice"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Administration er inkluderet i prisen"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isForParents then
                            i
                                [ class "fas"
                                , class "fa-users"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen er rettet mod forældre"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isInternal then
                            i
                                [ class "fas"
                                , class "fa-home"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen er et internt tilbud"
                                ]
                                []

                          else
                            i [] []
                        ]
                    ]
                ]
            ]

    else
        tr
            [ attribute "role" "row"
            , class "fixedheight"
            ]
            [ td []
                []
            , td []
                [ div []
                    [ a
                        [ class "link-dark"
                        , style "text-decoration" "none"
                        , href <| "/provider/" ++ String.fromInt provider.id
                        , id <| String.fromInt provider.id
                        , rel "noopener noreferrer"
                        , id "424"
                        , target "_blank"
                        ]
                        [ p []
                            [ text provider.name ]
                        ]
                    ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ text <| ifZero (String.fromInt (Maybe.withDefault 0 provider.contactPostalCode)) ] ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ text <| Maybe.withDefault "" provider.contactName ] ]
                ]
            , td []
                [ a
                    [ style "text-decoration" "none"
                    , style "color" "#000"
                    , href <| "/provider/" ++ String.fromInt provider.id
                    , id <| String.fromInt provider.id
                    , rel "noopener noreferrer"
                    , id "424"
                    , target "_blank"
                    ]
                    [ div [] [ text <| Maybe.withDefault "Kontakt for pris" provider.price ] ]
                ]
            , td []
                [ div []
                    [ span []
                        [ if provider.isOnline then
                            i
                                [ class "fas"
                                , class "fa-globe"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen tilbydes online"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isTransportIncluded then
                            i
                                [ class "fas"
                                , class "fa-car-side"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute "trigger"
                                    "hover focus click"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Kørsel er inkluderet i prisen"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isAdministrationIncluded then
                            i
                                [ class "fas"
                                , class "fa-file-invoice"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Administration er inkluderet i prisen"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isForParents then
                            i
                                [ class "fas"
                                , class "fa-users"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen er rettet mod forældre"
                                ]
                                []

                          else
                            i [] []
                        , if provider.isInternal then
                            i
                                [ class "fas"
                                , class "fa-home"
                                , style "margin-left" "0.5em"
                                , attribute "data-bs-toggle"
                                    "tooltip"
                                , attribute
                                    "data-bs-placement"
                                    "bottom"
                                , attribute "title" "Indsatsen er et internt tilbud"
                                ]
                                []

                          else
                            i [] []
                        ]
                    ]
                ]
            ]



-- SUBSCRIPTIONS
-- (i [ class "fas", class "fa-building" ] [])


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- On Enter


onEnter : Msg -> Attribute Msg
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                Decode.succeed msg

            else
                Decode.fail "not ENTER"
    in
    on "keydown" (Decode.andThen isEnter keyCode)


ifZero : String -> String
ifZero string =
    if string == "0" then
        ""

    else
        string



--- Sorting


sortByPostalCode : Provider -> Provider -> Order
sortByPostalCode fst snd =
    if Maybe.withDefault 0 fst.contactPostalCode <= Maybe.withDefault 0 snd.contactPostalCode then
        GT

    else
        LT


sortByPrice : Provider -> Provider -> Order
sortByPrice fst snd =
    if Maybe.withDefault "" fst.price == "Gratis" then
        LT

    else if Maybe.withDefault "" snd.price == "Gratis" then
        GT

    else if Maybe.withDefault "" fst.price == "Kontakt for pris" then
        GT

    else if Maybe.withDefault "" snd.price == "Kontakt for pris" then
        LT

    else if makePriceToInt (Maybe.withDefault "" fst.price) >= makePriceToInt (Maybe.withDefault "" snd.price) then
        GT

    else
        LT


makePriceToInt : String -> Int
makePriceToInt string =
    Maybe.withDefault 0 <|
        String.toInt <|
            Maybe.withDefault "0" <|
                List.head <|
                    String.split " " string
