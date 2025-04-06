# Changelog

## [2.0.0](https://github.com/odevine/edh-tracker/compare/edh-tracker-v2.0.0...edh-tracker-v2.0.0) (2025-04-06)


### Features

* add "include unranked" ([86804b2](https://github.com/odevine/edh-tracker/commit/86804b27bf267406a5ed9291179ab03bd5e623b3))
* add ability for admins to create modals ([9fc3f30](https://github.com/odevine/edh-tracker/commit/9fc3f30d5b389f493e2bcd4f898742c52eeae581))
* add auth context helper function ([7753be2](https://github.com/odevine/edh-tracker/commit/7753be2df87637f16f0c4b267ba415c90f9fb67e))
* add AuthContext to take over login flow from Amplify ([ccb60b5](https://github.com/odevine/edh-tracker/commit/ccb60b50439a07c38cb8893c9bda545f6d1c73a6))
* add format editing modal ([7b7c5c6](https://github.com/odevine/edh-tracker/commit/7b7c5c6badd00296bb5e7f1747d992fef61bd303))
* add FormatContext to take over handling "DeckCategories" from DeckContext ([04a26df](https://github.com/odevine/edh-tracker/commit/04a26dfcc32d6478432ab63694c8609b64f1006e))
* add initial ci/cd deploy scripts for FE ([052294e](https://github.com/odevine/edh-tracker/commit/052294e798d924bc5b29d847be62bd58e095d360))
* add initializing state to RequireAuth and AuthContext ([fa7353d](https://github.com/odevine/edh-tracker/commit/fa7353d488e54c2760eda289237f4688a703edb1))
* add integration tests for API and fix related APi bugs ([d328c7a](https://github.com/odevine/edh-tracker/commit/d328c7a1606a7464bfda3198b157c5847b2c09e7))
* add match DELETE route and tests ([5b42ce7](https://github.com/odevine/edh-tracker/commit/5b42ce75f800e780b30ea8b3f5f68ede62f8ec0b))
* add match-related tables and routes ([7b7624d](https://github.com/odevine/edh-tracker/commit/7b7624dad5756b85eb7726e68fc7eedb170c5a7c))
* add persistentState hook to new hooks directory ([a602dbc](https://github.com/odevine/edh-tracker/commit/a602dbc50f98f1aceac6ea8b619e276d93a351b3))
* add quick "mark as inactive" button in profile ([0cae94f](https://github.com/odevine/edh-tracker/commit/0cae94f2c6992b8c887688d8f9cb71125ec0ef8a))
* add SAM template for Formats, Users, and Decks ([0d50cee](https://github.com/odevine/edh-tracker/commit/0d50cee566ef76113d1eff1dbe6f2a6c24892f98))
* allow decks to be inactive and be hidden from the UI ([#38](https://github.com/odevine/edh-tracker/issues/38)) ([307be66](https://github.com/odevine/edh-tracker/commit/307be661c406b788c229146105aa75a944aa1b2d))
* change "activeUser" definition to be based on match history and not lastOnline ([12168a1](https://github.com/odevine/edh-tracker/commit/12168a1b06bdc961631c83cb5054ec487cdd3c15))
* clean up and utilize persistent state hook in ThemeContext ([09ec1a4](https://github.com/odevine/edh-tracker/commit/09ec1a4e05148f0b870ce49e368a70308cb231d2))
* convert DeckContext to use react-query and new API ([8fe68bd](https://github.com/odevine/edh-tracker/commit/8fe68bdd5370e5033db5219d340c26e3c23c110f))
* convert Decks and Match table actions to use menu dropdowns ([38a66f0](https://github.com/odevine/edh-tracker/commit/38a66f0ba60d756bf7210d8043eeda29b8ef923a))
* convert former "tools" page into a "formats" page ([66d0ef6](https://github.com/odevine/edh-tracker/commit/66d0ef6b449d73c45b71399e041f40ae383133ea))
* convert MatchContext to use react-query and new API ([e935a60](https://github.com/odevine/edh-tracker/commit/e935a60b11e013fa9bdef0d7d4663296229a559a))
* convert UserContext to use react-query and new API ([fc18d00](https://github.com/odevine/edh-tracker/commit/fc18d00136c4a4470a8ce8cd8940643d7a9e68f7))
* DecksTable modularization and cleanup ([f5e0bbc](https://github.com/odevine/edh-tracker/commit/f5e0bbc324a6af0e2d8719330f464c5274d740fa))
* enforce admin authentication inside format and user handler ([6f1a0bd](https://github.com/odevine/edh-tracker/commit/6f1a0bdf3792c8ea7382b4a3b0fc0a804e2c9c05))
* enforce admin authentication inside match handler ([8ae4141](https://github.com/odevine/edh-tracker/commit/8ae414170921ef1281c963693233a1edf459b37c))
* gate Deck update/delete behind user context ([8f256df](https://github.com/odevine/edh-tracker/commit/8f256dfa5c87227be5694e25a6431497b41c466e))
* implement ripple-out theme transition ([77fdd4f](https://github.com/odevine/edh-tracker/commit/77fdd4f0f6881fa9759184a1c8372611f61bf042))
* make CombinedProvider more scalable by accepting just an array of providers ([43d8696](https://github.com/odevine/edh-tracker/commit/43d869649027b79d15266ca29725f67137c1ba8d))
* MatchesTable modularization, cleanup, and conversion to MUI X DataGrid ([01cda51](https://github.com/odevine/edh-tracker/commit/01cda516c34436ac5ea8ebe036304ac508115051))
* migrate decks table to mui datagrid ([390bdb1](https://github.com/odevine/edh-tracker/commit/390bdb1de4a45565d7833ed2544608c6f15b5c6c))
* migrate user profile form to a modal for consistency ([b3c530f](https://github.com/odevine/edh-tracker/commit/b3c530f5bca0b97f4169a71673e7b9a351d363a0))
* more clearly display additional price check data ([217b9e9](https://github.com/odevine/edh-tracker/commit/217b9e9ca6799c626b386a4793b299bbffd10708))
* protect routes with new RequireAuth component ([69227a6](https://github.com/odevine/edh-tracker/commit/69227a6c28279b336f93c9f034e615689355f3ce))
* refactor common datagrid/table components ([4d29c1b](https://github.com/odevine/edh-tracker/commit/4d29c1b08c2db5ce300ab67072652c8d304368d2))
* remove commander color tracking in db, now represented as just deckColors ([c188b25](https://github.com/odevine/edh-tracker/commit/c188b25cb11251d5f6d9ee960111e07d83fd0f6e))
* return additional context from price check lambda ([aad7179](https://github.com/odevine/edh-tracker/commit/aad717975494a2ab92a5efb1f18ca1a86e8c6f41))
* roll all of the seed functions into a single package script ([deed7f2](https://github.com/odevine/edh-tracker/commit/deed7f2a886e3cff2f37a4f35ad53af3c65891c9))
* set up S3 and Cloudfront resources, and github actions for FE deployments ([3dca4ba](https://github.com/odevine/edh-tracker/commit/3dca4baaf9443fcf4418e5b83c68d619fb1d32db))
* update DeckModal with new context ([f3fbb69](https://github.com/odevine/edh-tracker/commit/f3fbb69c9bda39c26d3c24e12f06f25d53e12b85))
* update DeckSelector with new deck context ([4d22d03](https://github.com/odevine/edh-tracker/commit/4d22d031501a296fa20028272dcee4b18d1c1a4d))
* update DecksTable to use new context ([8b7a823](https://github.com/odevine/edh-tracker/commit/8b7a823ced372b4ac12c39ac10d9a0eed7a7669a))
* update LandingPage with new context ([0bf1b9f](https://github.com/odevine/edh-tracker/commit/0bf1b9f2f77408247186dcf7d68aa93b8fdd6ee2))
* update MatchesPage, DeckSelector, TypeSelector, statsLogic with new context ([f917bbc](https://github.com/odevine/edh-tracker/commit/f917bbc1a95ea603a17e3ccdc79c8935a6f30cf8))
* update MatchModal with new context ([3244ace](https://github.com/odevine/edh-tracker/commit/3244ace466b61f2d659ad2243a8ffb6f9878db30))
* update profile page and cards to use a new user stat function ([cbd5c7f](https://github.com/odevine/edh-tracker/commit/cbd5c7f3587bc02470c991d128a8f73c362067d9))
* update ProfileMiniCard, UserProfileForm, and PlayerSelector with new context ([4abfe44](https://github.com/odevine/edh-tracker/commit/4abfe44f8da11d5f035ef5a636b4b79814148499))
* update ProfilePage to use new context ([28547be](https://github.com/odevine/edh-tracker/commit/28547beda1219ab116171f45f2a28c9f3c75df81))
* update Toolbar component with new context ([bdd8a92](https://github.com/odevine/edh-tracker/commit/bdd8a923f78b32b9e3b2e913e8c909a16a5cc08f))
* update toolbar styles, minor tweak to profile avatars ([e51259e](https://github.com/odevine/edh-tracker/commit/e51259ecb688c134c099a32357fc6363929bd355))
* update user profile card to have edit button on avatar badge ([5603cd4](https://github.com/odevine/edh-tracker/commit/5603cd42d72b56d0215c242185dd1bd1e3f3b309))
* update UserDecksCard with new context ([3e431e9](https://github.com/odevine/edh-tracker/commit/3e431e95033b578991343d13f13bd4ccbf431cfd))
* update UsersPage and statsLogic (again) with new context ([e14962b](https://github.com/odevine/edh-tracker/commit/e14962b17269f20e06196b90abf0e328a5a99f13))
* UsersTable modularization, cleanup, and conversion to MUI X DataGrid ([ed279c1](https://github.com/odevine/edh-tracker/commit/ed279c1e2be82a55d4c47c9453d47b4beae3a4ef))


### Bug Fixes

* allow for usd_foil and usd_etched prices to supersede regular usd prices ([e1376c0](https://github.com/odevine/edh-tracker/commit/e1376c086a92d42270bfd44a0e72b2a5a7896fa0))
* allow match service to have CRUD access to the user and deck tables ([0a554b5](https://github.com/odevine/edh-tracker/commit/0a554b5edf5a48ee433a7a22abb943188cbcaaf0))
* avoid circular dependency with CombinedProvider ([6c8b0aa](https://github.com/odevine/edh-tracker/commit/6c8b0aa4ee36c661e956db2c5106fcbed4887bf0))
* bug with updating matches in MatchModal ([9213e00](https://github.com/odevine/edh-tracker/commit/9213e0041842b054e19096beb1aaa5eff06552c0))
* change DeckSelector "deckName" references to "displayName" ([39b37c6](https://github.com/odevine/edh-tracker/commit/39b37c6376736f3cb4a0b5efedfe0337421071f1))
* clean and update seed data/scripts ([b9ca667](https://github.com/odevine/edh-tracker/commit/b9ca6676d97b582bc6b914d511de16db44852184))
* clear theme storage on logout (pending refresh) ([9bfa24d](https://github.com/odevine/edh-tracker/commit/9bfa24de6fc461e6a7ac16af1d19c41954f43a33))
* construct commander search url correctly ([86f6a8a](https://github.com/odevine/edh-tracker/commit/86f6a8a10b36e5b1398bb644434e94375e840769))
* correct CORS allowed origins error for api gateway ([bad7838](https://github.com/odevine/edh-tracker/commit/bad7838f4e2a9dd280f31cb9e437469840eb47cf))
* correctly style avatar when not logged in ([052c249](https://github.com/odevine/edh-tracker/commit/052c249c83fe103a687229b426b382c46884e13f))
* deck filter not returning any items ([d5d0d34](https://github.com/odevine/edh-tracker/commit/d5d0d34b3ee853bf7c7cd9c5fe2710f1b91d5b65))
* deck links not being validated correctly ([f216249](https://github.com/odevine/edh-tracker/commit/f216249ac61ebd5f5f858c268048671763558408))
* disable format tab when not authenticated ([0f3d9ed](https://github.com/odevine/edh-tracker/commit/0f3d9ed9415d7bb2bb11b971d73995e9845e3eae))
* formats get saved in alphabetical order ([1c070b6](https://github.com/odevine/edh-tracker/commit/1c070b6758d0be461fe53252ba475674ee73261c))
* fully remove ToolsPage content (pending re-implementation) ([9c5e201](https://github.com/odevine/edh-tracker/commit/9c5e201979f20f61c802d4d53026c2e0ca10dae1))
* handling of colorless decks on both a table and seed data side ([d3a747d](https://github.com/odevine/edh-tracker/commit/d3a747dac7de3f3f99339248ff6e11cca14d67a2))
* have deck seeding correctly parse inactive status ([e1064f1](https://github.com/odevine/edh-tracker/commit/e1064f13fd07b3697740c482b14eac46f2dcd832))
* hide commander column when filtered to non-commander format ([63db2eb](https://github.com/odevine/edh-tracker/commit/63db2ebedf3a2a28c4b4f9584f2c742a7e899f4a))
* isAdmin always returning false in auth helper ([de2b39a](https://github.com/odevine/edh-tracker/commit/de2b39a960b9417edf62b63fbe8dce82346cf805))
* MenuItem fragment children warning ([c6b9bb8](https://github.com/odevine/edh-tracker/commit/c6b9bb8b2f0c7f8dbe128dc37100fa2a99475814))
* prevent vite dev server from intercepting pages as api calls ([21ccc2d](https://github.com/odevine/edh-tracker/commit/21ccc2de845a10592ae7386cc81c3d5fb23d1220))
* release please config file name ([52f2f2a](https://github.com/odevine/edh-tracker/commit/52f2f2a24c2e446667ce23944fb27d8b6cbdfacd))
* reloads redirecting to landing page ([7737248](https://github.com/odevine/edh-tracker/commit/77372488c77f907b6365a312dfe753da8d14d6fe))
* remove circular dependencies resulting from barrel files ([1183a46](https://github.com/odevine/edh-tracker/commit/1183a46775026ffdf1e90aae899af96e41d78d19))
* remove last references to commanderColors ([49b773e](https://github.com/odevine/edh-tracker/commit/49b773ee8ce70857d3360ad21aa3b8f93d67a1c6))
* requests being made while token is refreshing ([cfc2e3b](https://github.com/odevine/edh-tracker/commit/cfc2e3b1af9eee020a22f60eacc8b3de287ad772))
* temporarily remove handlers for pricecheck (pending re-implementation) ([a62af98](https://github.com/odevine/edh-tracker/commit/a62af9888be88f416ebe75191193d68e17bba3c5))
* update deck seed data and stats to remove nulls in secondCommander fields ([fbad45c](https://github.com/odevine/edh-tracker/commit/fbad45c26c4d506f7aeeba2a6db37e41934ae2fc))
* update format seed data and script ro reflect formats type change ([aaf92e2](https://github.com/odevine/edh-tracker/commit/aaf92e2ed0ed8a9a023ba69e25f3e3dc2fa80823))
* update match editing logic to not add additional participants ([baa1d81](https://github.com/odevine/edh-tracker/commit/baa1d810f8fa40be5888edfc9b4add6d5c9b2d7d))
* update release-please action to trigger on main ([531d3a0](https://github.com/odevine/edh-tracker/commit/531d3a032cb00eddd4e6748a1da3711b9ee666ec))
* update template to output fee deploy bucket name ([931e7fc](https://github.com/odevine/edh-tracker/commit/931e7fc39240087b1039ea08753595d45f9359c9))
* update template to output fee deploy bucket name ([6342c0d](https://github.com/odevine/edh-tracker/commit/6342c0db1c1a19646865be9b75e5e739449e6d85))
* update template to redirect correctly ([64b9eaa](https://github.com/odevine/edh-tracker/commit/64b9eaa4dcd59f54f15a16de078108a2dad96dca))
* update template with case changes ([36642de](https://github.com/odevine/edh-tracker/commit/36642de41b111c5a7ced519ddc9f31fbf64969bd))
* update testData scripts to reflect format type changes ([ab6ab7c](https://github.com/odevine/edh-tracker/commit/ab6ab7c53792ba0fca4f029805e8f83cbc28f8e1))
* update wording of access request message ([885ed60](https://github.com/odevine/edh-tracker/commit/885ed60d1c9ad0d72a2a3ccbe92e243cf441c4df))
* use correct build command during deploy ([6c36375](https://github.com/odevine/edh-tracker/commit/6c36375de36ddb2189027cb0fcd922be6962eb93))


### Miscellaneous Chores

* release 1.2.2 ([a075040](https://github.com/odevine/edh-tracker/commit/a075040ea7340a042926f32e8d8fb13a0eecc346))
* release 1.2.3 ([62e2b72](https://github.com/odevine/edh-tracker/commit/62e2b72159b028997996d68dd5edd26fe7eded24))
* release 1.3.1 ([3aa0eda](https://github.com/odevine/edh-tracker/commit/3aa0eda0eeb86f860a2226a89a0f1cd4aca8579b))
* release 1.4.2 ([043b504](https://github.com/odevine/edh-tracker/commit/043b5041360ce50c539d5e47854f14bb3c463231))
* release 2.0.0 ([7aa68ab](https://github.com/odevine/edh-tracker/commit/7aa68ab66bc751d3b6fb826d2f11a8f139dc5509))

## [1.4.2](https://github.com/odevine/edh-tracker/compare/edh-tracker-v1.4.1...edh-tracker-v1.4.2) (2025-04-06)


### Miscellaneous Chores

* release 1.4.2 ([043b504](https://github.com/odevine/edh-tracker/commit/043b5041360ce50c539d5e47854f14bb3c463231))

## [1.4.1](https://github.com/odevine/edh-tracker/compare/v1.4.0...v1.4.1) (2025-01-25)


### Bug Fixes

* update match editing logic to not add additional participants ([baa1d81](https://github.com/odevine/edh-tracker/commit/baa1d810f8fa40be5888edfc9b4add6d5c9b2d7d))

## [1.4.0](https://github.com/odevine/edh-tracker/compare/v1.3.1...v1.4.0) (2025-01-25)


### Features

* migrate decks table to mui datagrid ([390bdb1](https://github.com/odevine/edh-tracker/commit/390bdb1de4a45565d7833ed2544608c6f15b5c6c))


### Bug Fixes

* deck links not being validated correctly ([f216249](https://github.com/odevine/edh-tracker/commit/f216249ac61ebd5f5f858c268048671763558408))

## [1.3.1](https://github.com/odevine/edh-tracker/compare/v1.3.0...v1.3.1) (2024-11-05)


### Features

* add "include unranked" ([86804b2](https://github.com/odevine/edh-tracker/commit/86804b27bf267406a5ed9291179ab03bd5e623b3))


### Miscellaneous Chores

* release 1.3.1 ([3aa0eda](https://github.com/odevine/edh-tracker/commit/3aa0eda0eeb86f860a2226a89a0f1cd4aca8579b))

## [1.3.0](https://github.com/odevine/edh-tracker/compare/v1.2.4...v1.3.0) (2024-10-08)


### Features

* add quick "mark as inactive" button in profile ([0cae94f](https://github.com/odevine/edh-tracker/commit/0cae94f2c6992b8c887688d8f9cb71125ec0ef8a))

## [1.2.4](https://github.com/odevine/edh-tracker/compare/v1.2.3...v1.2.4) (2024-10-05)


### Bug Fixes

* allow for usd_foil and usd_etched prices to supersede regular usd prices ([e1376c0](https://github.com/odevine/edh-tracker/commit/e1376c086a92d42270bfd44a0e72b2a5a7896fa0))

## [1.2.3](https://github.com/odevine/edh-tracker/compare/v1.2.2...v1.2.3) (2024-10-05)


### Features

* more clearly display additional price check data ([217b9e9](https://github.com/odevine/edh-tracker/commit/217b9e9ca6799c626b386a4793b299bbffd10708))
* return additional context from price check lambda ([aad7179](https://github.com/odevine/edh-tracker/commit/aad717975494a2ab92a5efb1f18ca1a86e8c6f41))


### Miscellaneous Chores

* release 1.2.3 ([62e2b72](https://github.com/odevine/edh-tracker/commit/62e2b72159b028997996d68dd5edd26fe7eded24))

## [1.2.2](https://github.com/odevine/edh-tracker/compare/v1.0.0...v1.2.2) (2024-10-04)

### Features
  * allow decks to be marked as inactive to hide them from being viewed on decks table by default
  * add landing page for unauthenticated users to preview website
  * update readme to accurately reflect current state of application

### Miscellaneous Chores

* release 1.2.2 ([a075040](https://github.com/odevine/edh-tracker/commit/a075040ea7340a042926f32e8d8fb13a0eecc346))

## 1.0.0 (2024-10-02)


### Features

* initial release (technically 1.2.0) ([#38](https://github.com/odevine/edh-tracker/issues/38)) ([307be66](https://github.com/odevine/edh-tracker/commit/307be661c406b788c229146105aa75a944aa1b2d))
