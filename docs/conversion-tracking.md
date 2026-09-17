# Conversion tracking

Outbound Chaturbate destinations keep their existing campaign and `wm` configuration. The internal `/go/` routes add only `source=modellewebcam` and one validated `track` value from this fixed list.

| Track | Origin |
| --- | --- |
| `mw_home` | Homepage live cards and live CTA |
| `mw_hub` | `/modelle-webcam/` |
| `mw_hd` | `/modelle-hd/` |
| `mw_new` | `/nuove-modelle-webcam/` |
| `mw_tattoo` | `/modelle-tattoo/` |
| `mw_prosperose` | `/modelle-prosperose/` |
| `mw_italiane` | `/modelle-italiane/` |
| `mw_creator_model` | `/diventare-webcam-model/` |
| `mw_creator_camgirl` | `/diventare-camgirl/` |
| `mw_creator_work` | `/lavorare-in-webcam/` |
| `mw_creator_privacy` | `/privacy-webcam-model/` |
| `mw_creator_setup` | `/attrezzatura-webcam-model/` |
| `mw_creator_earnings` | `/guadagni-webcam-model/` |

The values contain no username, visitor identifier, IP address, or personal information. Unknown values are discarded. No database or postback receiver is present in this phase.

Chaturbate Dynamic Postbacks can be connected later for signup and purchase attribution. That future work should validate the provider signature and passthrough fields, define retention, and add secure storage only after the data requirements have been approved. No secret belongs in this document.
