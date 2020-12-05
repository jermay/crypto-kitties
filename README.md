# crypto-kitties
A Crypto Kitties clone. For fun... and maybe food for the Crypto Zombies tutorial! Mwuahahah!

https://www.cryptokitties.co/

Cattributes

https://guide.cryptokitties.co/guide/cat-features/genes

* Base Color
* Accent color
* Highlight color
* Mouth
* Pattern
* Eye shape
* Eye Color
* Fur

Academy Kitties DNA:

16 digit uint

Colors
00-01: Body Color (0-99)
02-03: Mouth, tail color (0-99)
04-05: Eye color (0-99)
06-07: Ear color (0-99)

Cattributes
08: Eye shape (0-9)
09: Decorative pattern (0-9)
10-11: Decorative pattern color (0-99)
12-13: Decorative pattern color 2 (0-99)
14: Animation
15: ? my own custom cattribute (0-9)

Bootcamp template
https://github.com/Ivan-on-Tech-Academy/academy-kitties-template/tree/master

Cooldown

https://guide.cryptokitties.co/guide/cat-features/cooldown-speed

| Generation  | Cooldown Name  | Cooldown Time  |
|---|---|---|
| 0, 1 | fast  | 1 minute  |
| 2, 3 | swift | 2 minutes |
| 4, 5 | swift | 5 minutes |
| 6, 7 | snappy | 10 minutes |
| 8, 9 | snappy | 30 minutes |
| 10, 11 | brisk | 1 hour |
| 12, 13 | brisk | 2 hours |
| 14, 15 | plodding | 4 hours |
| 16, 17 | plodding | 8 hours |
| 18, 19 | slow | 16 hours |
| 20, 21 | slow | 24 hours |
| 22, 23 | sluggish | 2 days |
| 24, 25 | sluggish | 4 days |
| 26+ | catatonic | 1 week |

## Config

This project uses `dotenv` and a `.env` config file which expects the following entries:

```
# 12 word seed phrase for the test net HD wallet provider
MNEMONIC=

# Infura project ID for the hosted ETH node
INFURA_PROJECT_ID=
```
