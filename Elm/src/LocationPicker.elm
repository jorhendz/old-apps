module LocationPicker exposing (..)

import CategorizationModels exposing (Area, PostalCode)
import Html exposing (Html)
import Html.Attributes as Attributes
import Prelude.Maybe exposing (mapMaybe)
import Selectize



---- MODEL


type alias Model =
    { textfieldSelection : Maybe String
    , textfieldMenu : Selectize.State String
    , locations : List Location
    }


init : List Location -> ( Model, Cmd Msg )
init locations =
    ( { textfieldSelection = Nothing
      , locations = locations
      , textfieldMenu =
            Selectize.closed
                "textfield-menu"
                identity
                (List.map (locationId >> Selectize.entry) locations)
      }
    , Cmd.none
    )


locationString : Location -> String
locationString loc =
    case loc of
        LocationPostalCode pc ->
            String.fromInt pc.number ++ " - " ++ pc.name

        LocationArea area ->
            area.name


locationList : List PostalCode -> List Area -> List Location
locationList postalCodes areas =
    List.map LocationArea areas ++ List.map LocationPostalCode postalCodes


type Location
    = LocationPostalCode PostalCode
    | LocationArea Area


locationId : Location -> String
locationId =
    locationString


locationEqual : Location -> Location -> Bool
locationEqual location location2 =
    locationId location == locationId location2


getLocation : List Location -> String -> Maybe Location
getLocation locations query =
    List.filter (locationId >> (\x -> x == query)) locations
        |> List.head



---- UPDATE


type Msg
    = TextfieldMenuMsg (Selectize.Msg String)
    | SelectTextfieldLicense (Maybe String)


update : Msg -> Model -> { model : Model, cmd : Cmd Msg, chosenLocation : Maybe Location }
update msg model =
    case msg of
        TextfieldMenuMsg selectizeMsg ->
            let
                ( newMenu, menuCmd, maybeMsg ) =
                    Selectize.update SelectTextfieldLicense
                        model.textfieldSelection
                        model.textfieldMenu
                        selectizeMsg

                newModel =
                    { model | textfieldMenu = newMenu }

                cmd =
                    menuCmd |> Cmd.map TextfieldMenuMsg
            in
            case maybeMsg of
                Just nextMsg ->
                    update nextMsg newModel
                        |> andDo cmd

                Nothing ->
                    { model = newModel, cmd = cmd, chosenLocation = Nothing }

        SelectTextfieldLicense newSelection ->
            let
                chosenLocation =
                    Maybe.andThen (getLocation model.locations) newSelection
            in
            { model =
                case chosenLocation of
                    Nothing ->
                        { model | textfieldSelection = newSelection }

                    Just _ ->
                        Tuple.first <| init model.locations
            , cmd = Cmd.none
            , chosenLocation = chosenLocation
            }


andDo :
    Cmd msg
    -> { model : m, cmd : Cmd msg, chosenLocation : a }
    -> { model : m, cmd : Cmd msg, chosenLocation : a }
andDo cmd2 { model, cmd, chosenLocation } =
    { model = model
    , cmd = Cmd.batch [ cmd, cmd2 ]
    , chosenLocation = chosenLocation
    }



---- VIEW


view : Model -> Html Msg
view model =
    Html.div
        [ Attributes.style "display" "flex"
        , Attributes.style "flex-flow" "column"
        , Attributes.style "width" "100%"
        , Attributes.style "position" "relative"
        , Attributes.style "overflow" "inherit%"
        , Attributes.style "z-index" "1000"
        ]
        [ Selectize.view
            viewConfigTextfield
            model.textfieldSelection
            model.textfieldMenu
            |> Html.map TextfieldMenuMsg
        ]



---- CONFIGURATION


viewConfigTextfield : Selectize.ViewConfig String
viewConfigTextfield =
    viewConfig textfieldSelector


viewConfigButton : Selectize.ViewConfig String
viewConfigButton =
    viewConfig buttonSelector


viewConfig : Selectize.Input String -> Selectize.ViewConfig String
viewConfig selector =
    Selectize.viewConfig
        { container = []
        , menu =
            [ Attributes.class "selectize__menu"
            , Attributes.style "width" "100%"
            ]
        , ul =
            [ Attributes.class "selectize__list"
            , Attributes.style "padding-left" "0"
            ]
        , entry =
            \tree mouseFocused keyboardFocused ->
                { attributes =
                    [ Attributes.class "selectize__item gaFilterByArea"
                    , Attributes.style "background-color"
                        "white"
                    , Attributes.style
                        "list-style"
                        "none"
                    , Attributes.style "padding-left" "1rem"
                    , Attributes.style "padding-top" "0.25rem"
                    , Attributes.style "padding-bottom" "0.25rem"
                    , Attributes.classList
                        [ ( "btn-secondaryColor"
                          , mouseFocused
                          )
                        , ( "selectize__item--key-selected"
                          , keyboardFocused
                          )
                        ]
                    , Attributes.style "background-color" <|
                        if keyboardFocused || mouseFocused then
                            "#e9ecef"

                        else
                            "white"
                    ]
                , children =
                    [ Html.text tree ]
                }
        , divider =
            \title ->
                { attributes =
                    [ Attributes.class "selectize__divider" ]
                , children =
                    [ Html.text title ]
                }
        , input = selector
        }


textfieldSelector : Selectize.Input String
textfieldSelector =
    Selectize.autocomplete <|
        { attrs =
            \sthSelected open ->
                [ Attributes.class "btn"
                , Attributes.class "btn-default"
                , Attributes.classList
                    [ ( "selectize__textfield--selection", sthSelected )
                    , ( "selectize__textfield--no-selection", not sthSelected )
                    , ( "selectize__textfield--menu-open", open )
                    ]
                , Attributes.style "width" "100%"
                , Attributes.style "border-style" "solid"
                , Attributes.style "border-color" "#B8B8B8"
                , Attributes.style "text-align" "left"
                ]
        , toggleButton = toggleButton
        , clearButton = clearButton
        , placeholder = "Vælg område eller postnummer..."
        }


buttonSelector : Selectize.Input String
buttonSelector =
    Selectize.simple
        { attrs =
            \sthSelected open ->
                [ Attributes.class "selectize__button"
                , Attributes.classList
                    [ ( "selectize__button--light", open && not sthSelected ) ]
                ]
        , toggleButton = toggleButton
        , clearButton = Nothing
        , placeholder = "Select a License"
        }


toggleButton : Maybe (Bool -> Html Never)
toggleButton =
    Just <|
        \open ->
            Html.i
                [ Attributes.class <|
                    "fa fa-caret-"
                        ++ (if open then
                                "up"

                            else
                                "down"
                           )
                , Attributes.style "padding-right" "1em"
                , Attributes.style "padding-top" "0.5em"
                , Attributes.style "height" "100%"
                , Attributes.style "vertical-align" "middle"
                ]
                []


clearButton : Maybe (Html Never)
clearButton =
    Just <|
        Html.div
            [ Attributes.class "selectize__menu-toggle" ]
            [ Html.i
                [ Attributes.class "material-icons"
                , Attributes.class "selectize__icon"
                ]
                [ Html.text "clear" ]
            ]
