module CategorizationModels exposing (..)

import Http
import Json.Decode as Decode exposing (Decoder, field, int, string)


type alias CategorizationModels =
    { postalCodes : List PostalCode
    , themes : List Theme
    , languages : List Language
    , regions : List Region
    , areas : List Area
    , serviceCategories : List ServiceCategory
    , creditations : List Creditation
    }


emptyCategorizationModels : CategorizationModels
emptyCategorizationModels =
    { postalCodes = []
    , themes = []
    , languages = []
    , regions = []
    , areas = []
    , serviceCategories = []
    , creditations = []
    }


getCategorizationModels : Cmd Msg
getCategorizationModels =
    Cmd.batch
        [ getPostalCodes
        , getThemes
        , getLanguages
        , getRegions
        , getServiceCategories
        , getAreas
        , getCreditations
        ]


{-| Messages sent to update the CategorizationModels
-}
type Msg
    = GotThemes (Result Http.Error (List Theme))
    | GotLanguages (Result Http.Error (List Language))
    | GotPostalCodes (Result Http.Error (List PostalCode))
    | GotRegions (Result Http.Error (List Region))
    | GotServiceCategories (Result Http.Error (List ServiceCategory))
    | GotAreas (Result Http.Error (List Area))
    | GotCreditations (Result Http.Error (List Creditation))


{-| Given an CategorizationModels.Msg will update a CategorizationModels accordingly.
Since the Msg can fail fetching from the Api, the return type is a Result being an Err
in case the Http request fail.
-}
update : Msg -> CategorizationModels -> Result Http.Error CategorizationModels
update msg models =
    case msg of
        GotThemes result ->
            Result.map (\themes -> { models | themes = themes }) result

        GotPostalCodes result ->
            Result.map (\pcs -> { models | postalCodes = pcs }) result

        GotRegions result ->
            Result.map (\regions -> { models | regions = regions }) result

        GotServiceCategories result ->
            Result.map (\scs -> { models | serviceCategories = scs }) result

        GotAreas result ->
            Result.map (\areas -> { models | areas = areas }) result

        GotLanguages result ->
            Result.map (\langs -> { models | languages = langs }) result

        GotCreditations result ->
            Result.map (\creds -> { models | creditations = creds }) result



--- Region


type alias Region =
    { id : Int
    , name : String
    }


regionDecoder : Decoder Region
regionDecoder =
    Decode.map2 Region
        (field "id" int)
        (field "name" string)


getRegions =
    Http.get
        { url = "/api/regions"
        , expect = Http.expectJson GotRegions (Decode.list regionDecoder)
        }



--- PostalCode


type alias PostalCode =
    { id : Int
    , name : String
    , number : Int
    }


getPostalCodes =
    Http.get
        { url = "/api/postal-codes"
        , expect = Http.expectJson GotPostalCodes (Decode.list postalCodeDecoder)
        }


postalCodeDecoder =
    Decode.map3 PostalCode
        (field "id" int)
        (field "name" string)
        (field "number" int)



--- Area


type alias Area =
    { id : Int
    , name : String
    }


getAreas =
    Http.get
        { url = "/api/areas"
        , expect = Http.expectJson GotAreas (Decode.list areaDecoder)
        }


areaDecoder =
    Decode.map2 Area
        (field "id" int)
        (field "name" string)



--- ServiceCategory


type alias ServiceCategory =
    { id : Int
    , name : String
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



--- Language


type alias Language =
    { id : Int
    , name : String
    }


languageDecoder =
    Decode.map2 Language
        (field "id" int)
        (field "name" string)


getLanguages =
    Http.get
        { url = "/api/languages"
        , expect = Http.expectJson GotLanguages (Decode.list languageDecoder)
        }



-- Theme


type ThemeType
    = SocialType
    | PhysicalType
    | MentalType


type alias Theme =
    { id : Int
    , name : String
    , theme_type : ThemeType
    }


themeTypeDecoder =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "Socialt" ->
                        Decode.succeed SocialType

                    "Fysisk" ->
                        Decode.succeed PhysicalType

                    "Psykisk" ->
                        Decode.succeed MentalType

                    somethingElse ->
                        Decode.fail <| "Unknown theme type: " ++ somethingElse
            )


themeDecoder =
    Decode.map3 Theme
        (field "id" int)
        (field "name" string)
        (field "theme_type" themeTypeDecoder)


getThemes =
    Http.get
        { url = "/api/themes/"
        , expect = Http.expectJson GotThemes (Decode.list themeDecoder)
        }



-- Creditation


type alias Creditation =
    { id : Int
    , name : String
    }


creditationDecoder =
    Decode.map2 Creditation
        (field "id" int)
        (field "name" string)


getCreditations =
    Http.get
        { url = "/api/creditations"
        , expect = Http.expectJson GotCreditations (Decode.list creditationDecoder)
        }
