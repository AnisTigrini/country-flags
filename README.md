# country-flags-svg-v2

SVG flags for 248 countries and territories, with lookups by name, nationality and ISO 3166-1 codes.
Use the Wikimedia Commons URLs, or self-host the SVG files that ship with the package.

This started as a fork of [country-flags-svg](https://github.com/ronatskiy/country-flags-svg), which is no longer maintained.

## Install

```sh
npm install country-flags-svg-v2
```

## Usage

```js
import { findFlagUrlByIso2Code, findFlagUrlByNationality } from "country-flags-svg-v2";

findFlagUrlByIso2Code("FR");
// => "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"

findFlagUrlByNationality("Australian");
// => "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_(converted).svg"
```

Lookups ignore case, accents and extra spaces (`"cote d'ivoire"` finds Côte d'Ivoire) and return `""` when nothing matches.

## Self-hosting the flags

By default the functions return Wikimedia Commons URLs. That means every flag a visitor sees is loaded from Wikimedia's
servers (which sees their IP address), your Content Security Policy must allow `upload.wikimedia.org`, and the image can
change whenever someone edits the file on Commons.

The package also contains every flag as `flags/<iso2>.svg` (`fr.svg`, `us.svg`...). Serve them yourself and point a resolver at them:

```sh
npx country-flags-svg-v2 copy ./public/flags
```

```js
import { createFlagResolver } from "country-flags-svg-v2";

const flags = createFlagResolver({ baseUrl: "/flags" });

flags.findFlagUrlByIso2Code("FR"); // => "/flags/fr.svg"
flags.findFlagUrlByCountryName("Japan"); // => "/flags/jp.svg"
```

A resolver has the same functions as the package's default exports. You can also:

- **Import a file through your bundler** (Vite, webpack...): `import frUrl from "country-flags-svg-v2/flags/fr.svg";`
- **Use jsDelivr without any setup**: `createFlagResolver({ baseUrl: JSDELIVR_BASE_URL })` returns URLs pinned to the
  installed package version, such as `https://cdn.jsdelivr.net/npm/country-flags-svg-v2@1.1.0/flags/fr.svg`, so the
  images never change under you.

## API

### `countries`

Every country, with these fields:

```js
{
	name: "France",
	demonym: "French",
	flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg",
	iso2: "FR",
	iso3: "FRA",
	numeric: "250",        // ISO 3166-1 numeric code (Kosovo has none)
	altSpellings: [...],   // only on some countries, e.g. ["UK"] for the United Kingdom
	flagFile: "fr.svg",    // file name inside flags/
	aspectRatio: 1.5,      // width / height of the SVG: 1 for Switzerland, 0.82 for Nepal...
	emoji: "🇫🇷",
}
```

### Lookup functions

Each returns the flag URL, or `""` if no country matches.

| Function | Example |
| --- | --- |
| `findFlagUrlByCountryName(name)` | `"Germany"`, or an alternative spelling such as `"Czechia"` |
| `findFlagUrlByNationality(demonym)` | `"German"` |
| `findFlagUrlByIso2Code(code)` | `"DE"` ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)) |
| `findFlagUrlByIso3Code(code)` | `"DEU"` ([ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)) |
| `findFlagUrlByNumericCode(code)` | `276` or `"276"` ([ISO 3166-1 numeric](https://en.wikipedia.org/wiki/ISO_3166-1_numeric)) |
| `getMapFlagUrlByIso2Code()` | `{ DE: "...", FR: "...", ... }` |
| `getMapFlagUrlByIso3Code()` | `{ DEU: "...", FRA: "...", ... }` |

### `createFlagResolver({ baseUrl })`

Returns all the lookup functions above, building URLs as `${baseUrl}/${flagFile}`. Without `baseUrl`, it returns Wikimedia URLs.

### `JSDELIVR_BASE_URL`

The jsDelivr URL of the `flags/` folder for the installed version.

### `toFlagEmoji(iso2)`

`toFlagEmoji("JP") // => "🇯🇵"`. Windows shows these emojis as two letters.

### Types

`Country`, `CountryData`, `Iso2Code`, `Iso3Code`, `FlagResolver` and `FlagResolverOptions` are exported.

## Flag licenses

The library code is MIT licensed. The flag images come from Wikimedia Commons and keep their own licenses. Most are
public domain, but a few (Honduras, Martinique, Saint Barthélemy, Netherlands Antilles, Oman) require attribution.
[`flags/sources.json`](flags/sources.json) lists the source, license and author of every file; keep it next to the
flags when you self-host them (`npx country-flags-svg-v2 copy` does).

## Contributing

To change a flag, update its Wikimedia URL in `src/data/countries.ts`, then:

```sh
npm run sync-flags   # downloads the SVGs into flags/, updates sources.json and aspect ratios
npm test             # offline checks of the data and the bundled files
npm run test:urls    # checks every Wikimedia URL works and no flag changed upstream
```

Set `WIKIMEDIA_USER_AGENT` to a value with your contact details when syncing, as
[Wikimedia asks](https://meta.wikimedia.org/wiki/User-Agent_policy). The URL checks also run weekly in CI.

## License

MIT
