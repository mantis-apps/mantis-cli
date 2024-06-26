# Changelog

## [0.9.2](https://github.com/mantis-apps/mantis-cli/compare/0.9.1...0.9.2) (2024-06-28)


### Bug Fixes

* storybook crashes on pnpm ([ec8ee38](https://github.com/mantis-apps/mantis-cli/commit/ec8ee38c88ad212131ebbfac34dd028453b10879))

## [0.9.1](https://github.com/mantis-apps/mantis-cli/compare/0.9.0...0.9.1) (2024-06-21)


### Bug Fixes

* **pnpm:** support what pnpm resolves after install ([ff76c5a](https://github.com/mantis-apps/mantis-cli/commit/ff76c5a81271da151deaa9926ad52b26f4e0f907))

# [0.9.0](https://github.com/mantis-apps/mantis-cli/compare/0.8.1...0.9.0) (2024-06-21)


### Features

* **templates:** support vite for mobile-client ([9795bd9](https://github.com/mantis-apps/mantis-cli/commit/9795bd92167a75aff75783b54c93ef6cfd4ee339))

## [0.8.1](https://github.com/mantis-apps/mantis-cli/compare/0.8.0...0.8.1) (2024-05-16)


### Bug Fixes

* hardcode nx version to 18.2.4 ([ad71fce](https://github.com/mantis-apps/mantis-cli/commit/ad71fcec35af474268109f90e701fc7c7c69d233))

# [0.8.0](https://github.com/mantis-apps/mantis-cli/compare/0.7.0...0.8.0) (2024-04-30)


### Features

* allow deployment on netlify ([1fea301](https://github.com/mantis-apps/mantis-cli/commit/1fea3015b20ee8fa79fcf98932eeacd38b232081))

# [0.7.0](https://github.com/mantis-apps/mantis-cli/compare/0.6.0...0.7.0) (2024-04-11)


### Features

* **init.command.ts:** add support for user selected pm ([a02161a](https://github.com/mantis-apps/mantis-cli/commit/a02161ad78ca8e613f8eb775ebb287b5fdda5715)), closes [#32](https://github.com/mantis-apps/mantis-cli/issues/32)
* **init.command.ts:** change package manager selection/install logic ([fa12a83](https://github.com/mantis-apps/mantis-cli/commit/fa12a834aa038b4bc90dc0e068539ccd0fed7850))
* **init.command.ts:** Remove unnecessary guard clause w/ pm selection ([b9881bd](https://github.com/mantis-apps/mantis-cli/commit/b9881bd76d810d27d37ca4ff2b9f24a66430b4dd)), closes [#32](https://github.com/mantis-apps/mantis-cli/issues/32)
* **init.command.ts:** replace ci command with install ([786638e](https://github.com/mantis-apps/mantis-cli/commit/786638edd107eff5763d2170e60e04878d716f1f))
* **init.command.ts:** Use installDependencies in favor of execa ([e1a329b](https://github.com/mantis-apps/mantis-cli/commit/e1a329b7436eb087331a461aa8014e5d341dad33)), closes [#32](https://github.com/mantis-apps/mantis-cli/issues/32)
* remove lock file from template ([c78e232](https://github.com/mantis-apps/mantis-cli/commit/c78e232053fc45b1d4a59ced8785c57e6df93dac))
* **templates/*:** add packages to pacakge.json in template ([af83cc6](https://github.com/mantis-apps/mantis-cli/commit/af83cc604c003f9ba97e4505d0eea0c2773e5294))

# [0.6.0](https://github.com/mantis-apps/mantis-cli/compare/0.4.3...0.6.0) (2024-04-10)


### Features

* **templates:** use analog v1 for mantis-todo ([a3341af](https://github.com/mantis-apps/mantis-cli/commit/a3341af9b082fbff48a24250551b29ee8c62f61d))

## [0.4.3](https://github.com/mantis-apps/mantis-cli/compare/0.4.2...0.4.3) (2024-04-08)

# 0.4.0 (2024-04-08)

### Bug Fixes

- bump patch number ([96a405a](https://github.com/mantis-apps/mantis-cli/commit/96a405a06773f7a6c7ee7b12d4bb3cd5dde80797))
- force v0.1.1 ([eec77a6](https://github.com/mantis-apps/mantis-cli/commit/eec77a6e99145e890fd5f8e8254ae13134c90336))
- force v0.3.0 ([105e979](https://github.com/mantis-apps/mantis-cli/commit/105e979b21133eb288f14447f3cdf8fa3abd8fbd))
- force v0.4.0 ([7dd2d5b](https://github.com/mantis-apps/mantis-cli/commit/7dd2d5b5f3ea02e75aeb0b36cc78abe5dd9d156a))
- gracefully handle ctrl+c after application stood up ([52b7dc5](https://github.com/mantis-apps/mantis-cli/commit/52b7dc5f29eb34540c970aac4c703c7742b96caf))
- **mantis-cli:** :pencil2: TYPO FIX IN INSTALL:LOCALLY SCRIPT ([e85f0e4](https://github.com/mantis-apps/mantis-cli/commit/e85f0e45d22299ad236172b3ad711b6f0914787f))
- **mobile-client:** fix e2e tests ([b04a0ad](https://github.com/mantis-apps/mantis-cli/commit/b04a0ad583c7c15f926bbcd2ccf172f6d75af4f3))
- **mobile-client:** fix storybook ([162de3d](https://github.com/mantis-apps/mantis-cli/commit/162de3d1be7ac2097e0562c71262bf9a699fa544))
- publishing of .gitignore ([b0a3bb4](https://github.com/mantis-apps/mantis-cli/commit/b0a3bb422326c668d93bb5b1bdcd704899288e89)), closes [#44](https://github.com/mantis-apps/mantis-cli/issues/44)

### Features

- add option for local db ([5c9dbab](https://github.com/mantis-apps/mantis-cli/commit/5c9dbab334c2a67f25d2d792828e3864b19b4fd6)), closes [#28](https://github.com/mantis-apps/mantis-cli/issues/28)
- automatically open browsers on serve ([90e675d](https://github.com/mantis-apps/mantis-cli/commit/90e675d20e81e9a6b501389ec45d66650cabda29))
- connect analog server to mongo ([cc08f24](https://github.com/mantis-apps/mantis-cli/commit/cc08f24625de75977fc5e375c510b5d697022007))
- convert web-client to analog ([05612ea](https://github.com/mantis-apps/mantis-cli/commit/05612eac158fcc439508122ac53c138d27cd10bd)), closes [#34](https://github.com/mantis-apps/mantis-cli/issues/34)
- **init:** implement init command ([4e34793](https://github.com/mantis-apps/mantis-cli/commit/4e347938cd451a28d727353e41592449d3c5c858)), closes [#16](https://github.com/mantis-apps/mantis-cli/issues/16)
- make app publishable to npm under mantis-app ([43b940d](https://github.com/mantis-apps/mantis-cli/commit/43b940d35ea7c70a0e287f63fbc1468e1a38f75e)), closes [#20](https://github.com/mantis-apps/mantis-cli/issues/20)
- **mantis-cli:** :construction_worker: Added Local Install Script ([b380f60](https://github.com/mantis-apps/mantis-cli/commit/b380f60dbdf4e0e358a3db90de668080e70c2b72))
- **mantis-cli:** :construction: Adding New Methods To Start Action ([b33ca9f](https://github.com/mantis-apps/mantis-cli/commit/b33ca9f4ce58be399a9bf2ef22ca73d8a4c2650d))
- **MANTIS-CLI:** :construction: Working In Bootstrapping ([970b85e](https://github.com/mantis-apps/mantis-cli/commit/970b85e41f7e87b4db7e1b8b0e0914cf2410c6db))
- **mantis-cli:** :construction: Working On Welcome Message ([d49ecc6](https://github.com/mantis-apps/mantis-cli/commit/d49ecc61a24b7b626f173ced6b84a5ef5803e624))
- **mantis-cli:** :sparkles: Added Default Options for Logger ([a1f30f4](https://github.com/mantis-apps/mantis-cli/commit/a1f30f48f86c94f62880577ab147bb13c13acf9d))
- **mantis-cli:** :sparkles: BOOTSTRAPPING ([2ab9d90](https://github.com/mantis-apps/mantis-cli/commit/2ab9d909504e43ca814648250f22766d860f21fe))
- **MANTIS-CLI:** :sparkles: Bootstrapping The Project ([b9378e8](https://github.com/mantis-apps/mantis-cli/commit/b9378e85f99ff37a5a23d1ac7895dbfae490c6b6))
- **mantis-cli:** :sparkles: BUilding a Logger ([254cdd6](https://github.com/mantis-apps/mantis-cli/commit/254cdd6ca69ebf5984bee4e24cd2a32b739c3746))
- **mantis-cli:** :sparkles: BUilding a Logger ([a708734](https://github.com/mantis-apps/mantis-cli/commit/a70873469f389e9a4773fe35c74f40b8203cb7e5))
- **mantis-cli:** :sparkles: Check Ports and App Launch Implemented ([bd38aa9](https://github.com/mantis-apps/mantis-cli/commit/bd38aa9b705114bb9dd42043342c46f388647d3b))
- **mantis-cli:** :sparkles: Dynamization of Actions & Commands Name ([0862793](https://github.com/mantis-apps/mantis-cli/commit/086279370a78d51cf1607287fee8c441d9be1553))
- **mantis-cli:** :sparkles: FINISHED ALL CRUCIAL STEPS ([46ee364](https://github.com/mantis-apps/mantis-cli/commit/46ee36402bc258b5c82582d08499edf0cb04c631))
- **mantis-cli:** :sparkles: Handling CTRL-C Command ([a6ad846](https://github.com/mantis-apps/mantis-cli/commit/a6ad8469f2351c62e9849802948ea5505dac1c4b))
- **mantis-cli:** :sparkles: Handling CTRL-C Command ([e731305](https://github.com/mantis-apps/mantis-cli/commit/e731305ba3facf7da16b6a5046e21a0740b50802))
- **mantis-cli:** :sparkles: LOGGER V1 ([d1956d4](https://github.com/mantis-apps/mantis-cli/commit/d1956d47f7f2fc10540d280a48ada7db2f1ffb46))
- **mantis-cli:** :sparkles: NX WORKSPACE CREATION & ACTIONS LOGIC ([4b4f45f](https://github.com/mantis-apps/mantis-cli/commit/4b4f45f609895e1a330a9368cdc1cce1f1be005d))
- **mantis-cli:** :sparkles: Start Action Correction ([e77311b](https://github.com/mantis-apps/mantis-cli/commit/e77311b04633f126e57ace03ef227fe1f3d07538))
- **mantis-cli:** :sparkles: START ACTION WORKFLOW ([62f9c04](https://github.com/mantis-apps/mantis-cli/commit/62f9c0484931bde217940e951c632b23b4e5ef72))
- **mantis-cli:** :sparkles: Straightforward Tooling Now Done ([8363624](https://github.com/mantis-apps/mantis-cli/commit/83636249f96ac104eba1c712fcd165e246f62ad8))
- **mantis-cli:** :sparkles: Switched To OOP ([8f62702](https://github.com/mantis-apps/mantis-cli/commit/8f627025068e310d3817dd50493ccd98278ebf01))
- **mantis-cli:** :sparkles: Welcome Message ([490f07f](https://github.com/mantis-apps/mantis-cli/commit/490f07fa3d2176f0ddc3941b61b8bb7c2a86aeeb))
- **mantis-cli:** :sparkles: Welcome Utilities ([4f6882e](https://github.com/mantis-apps/mantis-cli/commit/4f6882e357b97e054ff8be2a7a8092f8f3fc9bd3))
- **mantis-cli:** :sparkles: WORKSPACE CREATION ([af3329e](https://github.com/mantis-apps/mantis-cli/commit/af3329e1ca311a0c49ad2f124d04609430afbd98))
- **mantis-todo:** setup dx ([cafbbe2](https://github.com/mantis-apps/mantis-cli/commit/cafbbe2ff816c32f9a958e43bb56c08c6ef58584))
- prompt for db url ([738df18](https://github.com/mantis-apps/mantis-cli/commit/738df18a22b2d3e644366afd6991288fcdf545cd)), closes [#18](https://github.com/mantis-apps/mantis-cli/issues/18)
- prompt user for workspace name ([3b880f6](https://github.com/mantis-apps/mantis-cli/commit/3b880f62c62c70340cdfd71a1a5a943c44dfd4b5)), closes [#26](https://github.com/mantis-apps/mantis-cli/issues/26)
- suppress install output ([3aac1c4](https://github.com/mantis-apps/mantis-cli/commit/3aac1c49cb80b5e54e15e107a060bfc7a1d0cd36)), closes [#22](https://github.com/mantis-apps/mantis-cli/issues/22)
- use lockfile when installing deps ([35c0434](https://github.com/mantis-apps/mantis-cli/commit/35c043452ccf63a4164e61de3420510d83eaca07)), closes [#24](https://github.com/mantis-apps/mantis-cli/issues/24)
