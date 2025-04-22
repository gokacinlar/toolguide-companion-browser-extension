import type * as Types from './types.js';
export * from './static.js';

export class WebstoreLinks {
    public links: Types.Ids = {
        chrome: "https://chromewebstore.google.com/detail/toolguide-companion/jgneofggiaeliocifinjncdodelkmapi?pli=1",
        edge: "https://microsoftedge.microsoft.com/addons/detail/toolguide-companion/fpcikeppbedpnmfnolodcgppcfllleca",
    }
}

export class UnitFactors {
    // Define a general object to hold the unitConversion values
    public unitConversionFactors: Types.ConversionFactor = {
        "Millimeter": {
            "Centimeter": 0.1,
            "Meter": 0.001,
            "Kilometer": 0.000001,
            "Inch": 0.0393701,
            "Feet": 0.00328084,
            "Yard": 0.00109361,
            "Mile": 6.2137e-7
        },
        "Centimeter": {
            "Millimeter": 10,
            "Meter": 0.01,
            "Kilometer": 0.00001,
            "Inch": 0.393701,
            "Feet": 0.0328084,
            "Yard": 0.0109361,
            "Mile": 6.2137e-6
        },
        "Meter": {
            "Millimeter": 1000,
            "Centimeter": 100,
            "Kilometer": 0.001,
            "Inch": 39.3701,
            "Feet": 3.28084,
            "Yard": 1.09361,
            "Mile": 0.000621371
        },
        "Kilometer": {
            "Millimeter": 1000000,
            "Centimeter": 100000,
            "Meter": 1000,
            "Inch": 39370.1,
            "Feet": 3280.84,
            "Yard": 1093.61,
            "Mile": 0.621371
        },
        "Inch": {
            "Millimeter": 25.4,
            "Centimeter": 2.54,
            "Meter": 0.0254,
            "Kilometer": 0.0000254,
            "Feet": 0.0833333,
            "Yard": 0.0277778,
            "Mile": 1.5783e-5
        },
        "Feet": {
            "Millimeter": 304.8,
            "Centimeter": 30.48,
            "Meter": 0.3048,
            "Kilometer": 0.0003048,
            "Inch": 12,
            "Yard": 0.333333,
            "Mile": 0.000189394
        },
        "Yard": {
            "Millimeter": 914.4,
            "Centimeter": 91.44,
            "Meter": 0.9144,
            "Kilometer": 0.0009144,
            "Inch": 36,
            "Feet": 3,
            "Mile": 0.000568182
        },
        "Mile": {
            "Millimeter": 1.609e+6,
            "Centimeter": 160934,
            "Meter": 1609.34,
            "Kilometer": 1.60934,
            "Inch": 63360,
            "Feet": 5280,
            "Yard": 1760
        }
    }

    // Data storage conversion values
    public dataStorageConversionFactors: Types.ConversionFactor = {
        "Bits": {
            "Bytes": 0.125,
            "Kilobytes": 0.000125,
            "Megabytes": 0.000000125,
            "Gigabytes": 0.000000000125,
            "Terabytes": 0.000000000000125,
            "Petabytes": 0.000000000000000125
        },
        "Bytes": {
            "Bits": 8,
            "Kilobytes": 0.001,
            "Megabytes": 0.000001,
            "Gigabytes": 0.000000001,
            "Terabytes": 0.000000000001,
            "Petabytes": 0.000000000000001
        },
        "Kilobytes": {
            "Bits": 8192,
            "Bytes": 1024,
            "Megabytes": 0.001,
            "Gigabytes": 0.000001,
            "Terabytes": 0.000000001,
            "Petabytes": 0.000000000001
        },
        "Megabytes": {
            "Bits": 8388608,
            "Bytes": 1048576,
            "Kilobytes": 1024,
            "Gigabytes": 0.001,
            "Terabytes": 0.000001,
            "Petabytes": 0.000000001
        },
        "Gigabytes": {
            "Bits": 8589934592,
            "Bytes": 1073741824,
            "Kilobytes": 1048576,
            "Megabytes": 1024,
            "Terabytes": 0.001,
            "Petabytes": 0.000001
        },
        "Terabytes": {
            "Bits": 8796093022208,
            "Bytes": 1099511627776,
            "Kilobytes": 1073741824,
            "Megabytes": 1048576,
            "Gigabytes": 1024,
            "Petabytes": 0.001
        },
        "Petabytes": {
            "Bits": 9007199254740992,
            "Bytes": 1125899906842624,
            "Kilobytes": 1099511627776,
            "Megabytes": 1073741824,
            "Gigabytes": 1048576,
            "Terabytes": 1024
        }
    };

    // Speed Converter Factors
    public speedDataConversionFactors: Types.ConversionFactor = {
        "Meters per Second (M/S)": {
            "Meters per Second (M/S)": 1,
            "Meters per Hour (M/H)": 3600,
            "Kilometers per Second (KM/S)": 0.001,
            "Kilometers per Hour (KM/H)": 3.6,
            "Miles per Second (MI/S)": 0.000621371,
            "Miles per Hour (MI/H)": 2.23694,
            "Knots (kn)": 1.94384,
        },
        "Meters per Hour (M/H)": {
            "Meters per Second (M/S)": 0.000277778,
            "Meters per Hour (M/H)": 1,
            "Kilometers per Second (KM/S)": 0.000000277778,
            "Kilometers per Hour (KM/H)": 0.001,
            "Miles per Second (MI/S)": 0.000000172603,
            "Miles per Hour (MI/H)": 0.000621371,
            "Knots (kn)": 0.000539956,
        },
        "Kilometers per Second (KM/S)": {
            "Meters per Second (M/S)": 1000,
            "Meters per Hour (M/H)": 3600000,
            "Kilometers per Second (KM/S)": 1,
            "Kilometers per Hour (KM/H)": 3600,
            "Miles per Second (MI/S)": 621.371,
            "Miles per Hour (MI/H)": 2236.94,
            "Knots (kn)": 1943.84,
        },
        "Kilometers per Hour (KM/H)": {
            "Meters per Second (M/S)": 0.277778,
            "Meters per Hour (M/H)": 1000,
            "Kilometers per Second (KM/S)": 0.000277778,
            "Kilometers per Hour (KM/H)": 1,
            "Miles per Second (MI/S)": 0.000172603,
            "Miles per Hour (MI/H)": 0.621371,
            "Knots (kn)": 0.539956,
        },
        "Miles per Second (MI/S)": {
            "Meters per Second (M/S)": 1609.34,
            "Meters per Hour (M/H)": 5793600,
            "Kilometers per Second (KM/S)": 1.60934,
            "Kilometers per Hour (KM/H)": 5793.64,
            "Miles per Second (MI/S)": 1,
            "Miles per Hour (MI/H)": 3600,
            "Knots (kn)": 3128.69,
        },
        "Miles per Hour (MI/H)": {
            "Meters per Second (M/S)": 0.44704,
            "Meters per Hour (M/H)": 1609.34,
            "Kilometers per Second (KM/S)": 0.00044704,
            "Kilometers per Hour (KM/H)": 1.60934,
            "Miles per Second (MI/S)": 0.000277778,
            "Miles per Hour (MI/H)": 1,
            "Knots (kn)": 0.868976,
        },
        "Knots (kn)": {
            "Meters per Second (M/S)": 0.51444,
            "Meters per Hour (M/H)": 1852,
            "Kilometers per Second (KM/S)": 0.00051444,
            "Kilometers per Hour (KM/H)": 1.852,
            "Miles per Second (MI/S)": 0.000868976,
            "Miles per Hour (MI/H)": 1.15078,
            "Knots (kn)": 1,
        }
    }

    public timeDataConversionFactors: Types.ConversionFactor = {
        "Millisecond": {
            "Second": 0.001,
            "Minute": 0.0000166667,
            "Hour": 2.777777777E-7,
            "Day": 1.157407407E-8,
            "Week": 1.653439153E-9,
            "Month": 3.805175038E-10,
            "Year": 3.168808781E-11,
            "Decade": 3.168808781E-12,
            "Century": 3.168808781E-13,
            "Millenium": 3.168808781E-14
        },
        "Second": {
            "Millisecond": 1000,
            "Minute": 0.0166666667,
            "Hour": 0.0002777778,
            "Day": 0.0000115741,
            "Week": 0.0000016534,
            "Month": 3.805175038E-7,
            "Year": 3.168808781E-8,
            "Decade": 3.168808781E-9,
            "Century": 3.168808781E-10,
            "Millenium": 3.168808781E-11
        },
        "Minute": {
            "Millisecond": 60000,
            "Second": 60,
            "Hour": 0.0166666667,
            "Day": 0.0006944444,
            "Week": 0.0000992063,
            "Month": 0.0000228311,
            "Year": 0.0000019013,
            "Decade": 1.901285268E-7,
            "Century": 1.901285268E-8,
            "Millenium": 1.901285268E-9
        },
        "Hour": {
            "Millisecond": 3600000,
            "Second": 3600,
            "Minute": 60,
            "Day": 0.0416666667,
            "Week": 0.005952381,
            "Month": 0.001369863,
            "Year": 0.0001140771,
            "Decade": 0.0000114077,
            "Century": 0.0000011408,
            "Millenium": 1.140771161E-7
        },
        "Day": {
            "Millisecond": 86400000,
            "Second": 86400,
            "Minute": 1440,
            "Hour": 24,
            "Week": 0.1428571429,
            "Month": 0.0328767123,
            "Year": 0.0027378508,
            "Decade": 0.0002737851,
            "Century": 0.0000273785,
            "Millenium": 0.0000027379
        },
        "Week": {
            "Millisecond": 604800000,
            "Second": 604800,
            "Minute": 10080,
            "Hour": 168,
            "Day": 7,
            "Month": 0.2301369863,
            "Year": 0.0191649555,
            "Decade": 0.0019164956,
            "Century": 0.0001916496,
            "Millenium": 0.000019165
        },
        "Month": {
            "Millisecond": 2628000000,
            "Second": 2628000,
            "Minute": 43800,
            "Hour": 730,
            "Day": 30,
            "Week": 4,
            "Year": 0.0832762948,
            "Decade": 0.0083276295,
            "Century": 0.0008327629,
            "Millenium": 0.0000832763
        },
        "Year": {
            "Millisecond": 31557600000,
            "Second": 31557600,
            "Minute": 525960,
            "Hour": 8766,
            "Day": 365,
            "Week": 52,
            "Month": 12,
            "Decade": 0.1,
            "Century": 0.01,
            "Millenium": 0.001
        },
        "Decade": {
            "Millisecond": 315576000000,
            "Second": 315576000,
            "Minute": 5259600,
            "Hour": 87660,
            "Day": 3652.5,
            "Week": 521,
            "Month": 120,
            "Year": 10,
            "Century": 0.1,
            "Millenium": 0.01
        },
        "Century": {
            "Millisecond": 3155760000000,
            "Second": 3155760000,
            "Minute": 52596000,
            "Hour": 876600,
            "Day": 36525,
            "Week": 5217,
            "Month": 1200,
            "Year": 100,
            "Decade": 10,
            "Millenium": 0.1
        },
        "Millenium": {
            "Millisecond": 31557600000000,
            "Second": 31557600000,
            "Minute": 525960000,
            "Hour": 8766000,
            "Day": 365250,
            "Week": 52178,
            "Month": 12008,
            "Year": 1000,
            "Decade": 100,
            "Century": 10
        }
    }
}

export class ConversionValues {
    public baseConverterOptions: Types.Option[] = [
        { key: "Binary", value: "Binary" },
        { key: "Decimal", value: "Decimal" },
        { key: "Octal", value: "Octal" },
        { key: "Hexademical", value: "Hexademical" }
    ];

    public dataConverterOptions: Types.Option[] = [
        { key: "Bits", value: "Bits" },
        { key: "Bytes", value: "Bytes" },
        { key: "Kilobytes", value: "Kilobytes" },
        { key: "Megabytes", value: "Megabytes" },
        { key: "Gigabytes", value: "Gigabytes" },
        { key: "Terabytes", value: "Terabytes" },
        { key: "Petabytes", value: "Petabytes" },
    ];

    public lengthOptions: Types.Option[] = [
        { key: "Millimeter", value: "Millimeter" },
        { key: "Centimeter", value: "Centimeter" },
        { key: "Meter", value: "Meter" },
        { key: "Kilometer", value: "Kilometer" },
        { key: "Inch", value: "Inch" },
        { key: "Feet", value: "Feet" },
        { key: "Yard", value: "Yard" },
        { key: "Mile", value: "Mile" },
    ];

    public speedConverterOptions: Types.Option[] = [
        { key: "MpS", value: "Meters per Second (M/S)" },
        { key: "MpH", value: "Meters per Hour (M/H)" },
        { key: "KMpS", value: "Kilometers per Second (KM/S)" },
        { key: "KMpH", value: "Kilometers per Hour (KM/H)" },
        { key: "MIpS", value: "Miles per Second (MI/S)" },
        { key: "MIpH", value: "Miles per Hour (MI/H)" },
        { key: "Knots", value: "Knots (kn)" },
    ];

    public timeConverterOptions: Types.Option[] = [
        { key: "Millisecond", value: "Millisecond" },
        { key: "Second", value: "Second" },
        { key: "Minute", value: "Minute" },
        { key: "Hour", value: "Hour" },
        { key: "Day", value: "Day" },
        { key: "Week", value: "Week" },
        { key: "Month", value: "Month" },
        { key: "Year", value: "Year" },
        { key: "Decade", value: "Decade" },
        { key: "Century", value: "Century" },
        { key: "Millenium", value: "Millenium" }
    ]
}

export class Currencies {
    public currencyValues: Array<string> = [
        "USD - US Dollar",
        "EUR - Euro",
        "GBP - British Pound",
        "CAD - Canadian Dollar",
        "AUD - Australian Dollar",
        "NZD - New Zealand Dollar",
        "CHF - Swiss Franc",
        "JPY - Japanese Yen",
        "CNY - Chinese Yuan",
        "RUB - Russian Ruble",
        "SEK - Swedish Krona",
        "TRY - Turkish Lira",
        "BRL - Brazilian Real",
    ];
}

export class LoremContent {
    public loremSentences: Array<string> = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Nunc accumsan sem ut ligula scelerisque sollicitudin.",
        "Ut at sagittis augue, praesentium voluptate voluptas sit aspernatur.",
        "Maecenas faucibus mollis interdum, auctor a ornare ut, laoreet in dolor.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
        "Donec eu libero sit amet quam egestas semper, auctor faucibus, pharetra in, orci.",
        "Quisque id mi, mattis eget, ultricies ut, pharetra sit amet, diam.",
        "Suspendisse potenti, in eleifend sapien, sed, vestibulum purus, sit amet, diam.",
        "Aliquam erat volutpat, sed, vestibulum purus, sit amet, diam.",
        "Ut venenatis tellus in metus laoreet, sit amet, ultrices semper.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
    ];
}

export class ElementStyling {
    public BASIC_TEMPLATE: Types.AsideButtons = {
        classes: {
            ul: "app-calc-ul d-flex flex-row flex-nowrap gap-2 align-items-center justify-content-start position-relative overflow-x-visible",
            button: "component-tab-nav-button btn btn-discovery w-100 fs-4 shadow-lg rounded-3",
            componentElement: "component-tab-content-element py-2 my-2",
            calcButtons: "calc-button btn btn-primary rounded-pill fs-3 w-100 shadow-md px-3 py-3",
            calcButtonsExtra: "calc-keys btn btn-discovery rounded-pill fs-3 fw-medium w-100 shadow-lg px-3 py-3"
        }
    }

    public STYLINGS: Types.AsideButtons = {
        welcome: {
            div: "d-flex flex-column align-items-center justify-content-center gap-2 px-4 py-4",
            imgPath: "/images/icons/robot.svg"
        },
        documentStyling: {
            main: "d-flex flex-column align-content-center justify-content-start",
            mainPlaceholder: "info-placeholder d-flex flex-column align-items-center justify-content-center gap-2"
        },
        ids: {
            dynamicContent: "dynamicContent"
        }
    }
}

export class JSONData {
    public jsonDataSrc: Record<string, string> = {
        users: "https://jsonplaceholder.typicode.com/users",
        todos: "https://jsonplaceholder.typicode.com/todos",
        photos: "https://jsonplaceholder.typicode.com/photos",
        albums: "https://jsonplaceholder.typicode.com/albums",
        comments: "https://jsonplaceholder.typicode.com/comments",
        posts: "https://jsonplaceholder.typicode.com/posts"
    };

    public randQuoteDataSrc: Record<string, string> = {
        randQuote: "https://api.quotable.io/random"
    }
}
