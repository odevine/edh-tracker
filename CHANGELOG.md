# Changelog

## [1.4.2](https://github.com/odevine/edh-tracker/compare/edh-tracker-v1.4.1...edh-tracker-v1.4.2) (2025-04-07)


### Features

* add "include unranked" ([86804b2](https://github.com/odevine/edh-tracker/commit/86804b27bf267406a5ed9291179ab03bd5e623b3))
* add ability for admins to create modals ([4ccf9f7](https://github.com/odevine/edh-tracker/commit/4ccf9f701f657aac4c62e601352820b4c2fb8b54))
* add auth context helper function ([48cc0df](https://github.com/odevine/edh-tracker/commit/48cc0df71c1f041c53b6ad27f43e2bffd8114aaa))
* add AuthContext to take over login flow from Amplify ([54d70d6](https://github.com/odevine/edh-tracker/commit/54d70d622987ef66ebc8b669b684589954987d91))
* add format editing modal ([bf9d0f4](https://github.com/odevine/edh-tracker/commit/bf9d0f45e6fc80466e04f16bb08426d72a8e99a0))
* add FormatContext to take over handling "DeckCategories" from DeckContext ([a9d55e9](https://github.com/odevine/edh-tracker/commit/a9d55e93835041960d8a11c10889d505d5b127e4))
* add initial ci/cd deploy scripts for FE ([290d575](https://github.com/odevine/edh-tracker/commit/290d5755c38712c86fc78b0b9f51e05336a5501b))
* add initializing state to RequireAuth and AuthContext ([a5493ef](https://github.com/odevine/edh-tracker/commit/a5493ef133ac706da36fcfb0a584d6026590593c))
* add integration tests for API and fix related APi bugs ([48fbc74](https://github.com/odevine/edh-tracker/commit/48fbc747aa77a952ea6b742bd48152cf810f0e09))
* add match DELETE route and tests ([faaf287](https://github.com/odevine/edh-tracker/commit/faaf287fd8caa3832f0d8ef5d7a1356268c83fce))
* add match-related tables and routes ([1e6c686](https://github.com/odevine/edh-tracker/commit/1e6c6865bb2c26091e1cfbe86ee197b353a536d3))
* add persistentState hook to new hooks directory ([c297fbd](https://github.com/odevine/edh-tracker/commit/c297fbdbff5bd61d4290c7906c220c2e94cc5da3))
* add quick "mark as inactive" button in profile ([0cae94f](https://github.com/odevine/edh-tracker/commit/0cae94f2c6992b8c887688d8f9cb71125ec0ef8a))
* add SAM template for Formats, Users, and Decks ([993555e](https://github.com/odevine/edh-tracker/commit/993555e8bab648f7e852654d001b3f9c9b9f47fc))
* allow decks to be inactive and be hidden from the UI ([#38](https://github.com/odevine/edh-tracker/issues/38)) ([307be66](https://github.com/odevine/edh-tracker/commit/307be661c406b788c229146105aa75a944aa1b2d))
* change "activeUser" definition to be based on match history and not lastOnline ([eecbf75](https://github.com/odevine/edh-tracker/commit/eecbf75dc9c34ea0a887d05761fcce16c93a176c))
* clean up and utilize persistent state hook in ThemeContext ([9640198](https://github.com/odevine/edh-tracker/commit/96401981df9d82067ecf77c05c77bd4dea3fd63a))
* convert DeckContext to use react-query and new API ([2373c5d](https://github.com/odevine/edh-tracker/commit/2373c5de9d970b268b8d212c7e701c53236f54fb))
* convert Decks and Match table actions to use menu dropdowns ([ed0a8c5](https://github.com/odevine/edh-tracker/commit/ed0a8c56222281028383ad2fb187b57c5f6ef652))
* convert former "tools" page into a "formats" page ([9c12f71](https://github.com/odevine/edh-tracker/commit/9c12f71303edbeac5bf2a715f4982b7e16d2348b))
* convert MatchContext to use react-query and new API ([41a5ef8](https://github.com/odevine/edh-tracker/commit/41a5ef8f91876a78433ca7e70e57a27076624294))
* convert UserContext to use react-query and new API ([a4f1274](https://github.com/odevine/edh-tracker/commit/a4f1274f4f1cbc9dfb8b399379999c9914d4cc68))
* DecksTable modularization and cleanup ([e05463b](https://github.com/odevine/edh-tracker/commit/e05463bd1114524cba61676695f0611aadc20e17))
* enforce admin authentication inside format and user handler ([8318928](https://github.com/odevine/edh-tracker/commit/8318928832bd590904d955447d032eaaf2df969c))
* enforce admin authentication inside match handler ([a6cede2](https://github.com/odevine/edh-tracker/commit/a6cede2630f234292d7ef7069c323ae28d0344af))
* gate Deck update/delete behind user context ([2c31cbc](https://github.com/odevine/edh-tracker/commit/2c31cbcf3dd64b08d9a88ed30fcf2f9f6dd121d9))
* implement ripple-out theme transition ([8940849](https://github.com/odevine/edh-tracker/commit/8940849b6e6233666a95802c706a7165cb8817eb))
* make CombinedProvider more scalable by accepting just an array of providers ([c420706](https://github.com/odevine/edh-tracker/commit/c420706a32174740dcd8cdf40b0f7f457be432d6))
* MatchesTable modularization, cleanup, and conversion to MUI X DataGrid ([6405831](https://github.com/odevine/edh-tracker/commit/64058317b22e497887bcb54d44203587fd6c4b76))
* migrate decks table to mui datagrid ([390bdb1](https://github.com/odevine/edh-tracker/commit/390bdb1de4a45565d7833ed2544608c6f15b5c6c))
* migrate user profile form to a modal for consistency ([229d9bd](https://github.com/odevine/edh-tracker/commit/229d9bdf62e281dded8ccfa8a3b7cb49bbc3093f))
* more clearly display additional price check data ([217b9e9](https://github.com/odevine/edh-tracker/commit/217b9e9ca6799c626b386a4793b299bbffd10708))
* protect routes with new RequireAuth component ([6e2c2d4](https://github.com/odevine/edh-tracker/commit/6e2c2d4421eaca1ce8e5069b5976364b8a6f66a7))
* refactor common datagrid/table components ([f627416](https://github.com/odevine/edh-tracker/commit/f6274164ab1e8b1c4b006ef78250e54ed66797f6))
* remove commander color tracking in db, now represented as just deckColors ([996e07b](https://github.com/odevine/edh-tracker/commit/996e07b235644b14feadd2c4e462c24ac58b1fff))
* return additional context from price check lambda ([aad7179](https://github.com/odevine/edh-tracker/commit/aad717975494a2ab92a5efb1f18ca1a86e8c6f41))
* roll all of the seed functions into a single package script ([d8aa903](https://github.com/odevine/edh-tracker/commit/d8aa903e34d850d7ffe4ca8cea8dfd372ce21ee3))
* set up S3 and Cloudfront resources, and github actions for FE deployments ([73ccafc](https://github.com/odevine/edh-tracker/commit/73ccafcf1941a1713e70ce47190a181fdbf3b536))
* update DeckModal with new context ([539498f](https://github.com/odevine/edh-tracker/commit/539498f464ba6ab94f5835f804dbc6d1b25b9a42))
* update DeckSelector with new deck context ([c4a7ca8](https://github.com/odevine/edh-tracker/commit/c4a7ca8b848658133f27d4f4dbb7a7da25134bd4))
* update DecksTable to use new context ([2a709f8](https://github.com/odevine/edh-tracker/commit/2a709f8339460b7cffe5112c3e9458915ba3d509))
* update LandingPage with new context ([92899db](https://github.com/odevine/edh-tracker/commit/92899db37125d04bb64a4b3d00a00adf556590e0))
* update MatchesPage, DeckSelector, TypeSelector, statsLogic with new context ([8e81d01](https://github.com/odevine/edh-tracker/commit/8e81d01223d1bffff50ba17a9dd75a270b211613))
* update MatchModal with new context ([75bf871](https://github.com/odevine/edh-tracker/commit/75bf871c9adc3e890fd588b99ce5d53e9d43b90a))
* update profile page and cards to use a new user stat function ([5c18e69](https://github.com/odevine/edh-tracker/commit/5c18e690ef07932908d2f1374e3401af3049b080))
* update ProfileMiniCard, UserProfileForm, and PlayerSelector with new context ([2ddbb84](https://github.com/odevine/edh-tracker/commit/2ddbb84ee757c5f66920dd0c1d5f6d272095858d))
* update ProfilePage to use new context ([7f6313f](https://github.com/odevine/edh-tracker/commit/7f6313f39341b6b4677ae9ba97464b81813d2604))
* update Toolbar component with new context ([c6b7771](https://github.com/odevine/edh-tracker/commit/c6b77717caea45ef054b778a2b091e83bac655a6))
* update toolbar styles, minor tweak to profile avatars ([c2f29ed](https://github.com/odevine/edh-tracker/commit/c2f29edf8ddb57772703db5f781697700d0eb3d4))
* update user profile card to have edit button on avatar badge ([aedc1c6](https://github.com/odevine/edh-tracker/commit/aedc1c65979ded9020ae6257eaebc63c9d10fe79))
* update UserDecksCard with new context ([f02b7ee](https://github.com/odevine/edh-tracker/commit/f02b7ee8d8432d3ffefbf639a634f900e920f654))
* update UsersPage and statsLogic (again) with new context ([a3b88ca](https://github.com/odevine/edh-tracker/commit/a3b88ca89713e8d8079bd7ad9a36934e27ff29bb))
* UsersTable modularization, cleanup, and conversion to MUI X DataGrid ([8cc9e6a](https://github.com/odevine/edh-tracker/commit/8cc9e6a85dd5e568d9b9a9b78505f02f9a3e8e28))


### Bug Fixes

* allow for usd_foil and usd_etched prices to supersede regular usd prices ([e1376c0](https://github.com/odevine/edh-tracker/commit/e1376c086a92d42270bfd44a0e72b2a5a7896fa0))
* allow match service to have CRUD access to the user and deck tables ([8b15be3](https://github.com/odevine/edh-tracker/commit/8b15be37d25dfcadaf24e68a145b3e981a32ab5f))
* avoid circular dependency with CombinedProvider ([fff7302](https://github.com/odevine/edh-tracker/commit/fff7302af19ab5df699e2e2f0e387251af7568dc))
* bug with updating matches in MatchModal ([4c7b6aa](https://github.com/odevine/edh-tracker/commit/4c7b6aa75bda7cc8e6683ad7cedcbb915a00b016))
* change DeckSelector "deckName" references to "displayName" ([b5157bf](https://github.com/odevine/edh-tracker/commit/b5157bfa51d80cdf1d30e97062755d7f2fe90bee))
* clean and update seed data/scripts ([b6384e0](https://github.com/odevine/edh-tracker/commit/b6384e00e7b52422cf5305c6c702a6186fc812e3))
* clear theme storage on logout (pending refresh) ([d6e2c3b](https://github.com/odevine/edh-tracker/commit/d6e2c3b5d964fed604e155d23c904bf0d133c196))
* construct commander search url correctly ([2bcc399](https://github.com/odevine/edh-tracker/commit/2bcc39917c00502d509fe2ce92356837647166b6))
* correct CORS allowed origins error for api gateway ([f18e7d5](https://github.com/odevine/edh-tracker/commit/f18e7d5f3ea4a978431ad226f0e378c98f58c677))
* correctly style avatar when not logged in ([cbb31ad](https://github.com/odevine/edh-tracker/commit/cbb31ad323a6234acc3034f621412b326b66cd88))
* deck filter not returning any items ([00da808](https://github.com/odevine/edh-tracker/commit/00da8089659521a70864f491451d4d33236f0d9e))
* deck links not being validated correctly ([f216249](https://github.com/odevine/edh-tracker/commit/f216249ac61ebd5f5f858c268048671763558408))
* disable format tab when not authenticated ([46a5bea](https://github.com/odevine/edh-tracker/commit/46a5bea086dea0322f136e56f5914d30e537348c))
* final tweaks to scripts and configs before initiating 2.0.0 release ([01177b4](https://github.com/odevine/edh-tracker/commit/01177b4b404850490396659ac9632a12787e8283))
* formats get saved in alphabetical order ([e2c2a62](https://github.com/odevine/edh-tracker/commit/e2c2a62a399ef4e11f9f6150f6366a198e42beb6))
* fully remove ToolsPage content (pending re-implementation) ([fb5c19c](https://github.com/odevine/edh-tracker/commit/fb5c19c604e03acc977031ff1509022bb735958f))
* handling of colorless decks on both a table and seed data side ([07c5b6b](https://github.com/odevine/edh-tracker/commit/07c5b6bc8c4b946d4816a35dbb1e12735193c0d3))
* have deck seeding correctly parse inactive status ([2201a0b](https://github.com/odevine/edh-tracker/commit/2201a0b36a7dfc733149c990666e24c561ddcc89))
* hide commander column when filtered to non-commander format ([059831a](https://github.com/odevine/edh-tracker/commit/059831a35bce7277853413404ac4cb73e2e6d36f))
* isAdmin always returning false in auth helper ([c10bb33](https://github.com/odevine/edh-tracker/commit/c10bb33639d6eaa921b5647bba27702d288a10ec))
* MenuItem fragment children warning ([2d72503](https://github.com/odevine/edh-tracker/commit/2d725031212f0c0f79db433c28f071229631e0ec))
* prevent vite dev server from intercepting pages as api calls ([7cc4f65](https://github.com/odevine/edh-tracker/commit/7cc4f65a01b26b0ffd4817bbb65f84914a3675ca))
* release please config file name ([68a6481](https://github.com/odevine/edh-tracker/commit/68a6481e6831f55fd6df3941595acd8470b44409))
* reloads redirecting to landing page ([0715ad5](https://github.com/odevine/edh-tracker/commit/0715ad565e8914bd7d0bfaa3e640edbcd4aa67ef))
* remove circular dependencies resulting from barrel files ([49e9dff](https://github.com/odevine/edh-tracker/commit/49e9dff9fa7e24ea70260e79b8a04df6fa78a3ac))
* remove last references to commanderColors ([e1686fc](https://github.com/odevine/edh-tracker/commit/e1686fc4743c3f8db9b941df0cf8cc92d4a77880))
* requests being made while token is refreshing ([c09fb12](https://github.com/odevine/edh-tracker/commit/c09fb12fc875542abadf87443463986e72936873))
* temporarily remove handlers for pricecheck (pending re-implementation) ([bf413d1](https://github.com/odevine/edh-tracker/commit/bf413d1bc6517f21d766f2f908c6d850ddf9873e))
* unranked commanders getting removed ([3cbf118](https://github.com/odevine/edh-tracker/commit/3cbf118bec0860f25e98189818d991849f4e275e))
* update deck seed data and stats to remove nulls in secondCommander fields ([d92533f](https://github.com/odevine/edh-tracker/commit/d92533fcb167ba68a2863da61e22c46e7405769e))
* update format seed data and script ro reflect formats type change ([d2ca4c1](https://github.com/odevine/edh-tracker/commit/d2ca4c1251076e192db0f324191b274d2d957b83))
* update match editing logic to not add additional participants ([baa1d81](https://github.com/odevine/edh-tracker/commit/baa1d810f8fa40be5888edfc9b4add6d5c9b2d7d))
* update release-please action to trigger on main ([9b1b44d](https://github.com/odevine/edh-tracker/commit/9b1b44d487ca5d1f9ad14c26d49ae50ac0a87573))
* update template to output fee deploy bucket name ([7c5959b](https://github.com/odevine/edh-tracker/commit/7c5959b042c909ee856c56c6132a0323e9579ab6))
* update template to redirect correctly ([50c29ce](https://github.com/odevine/edh-tracker/commit/50c29ce45ee68b4e82bbc76f3234fe80b5847e4d))
* update template with case changes ([b8701ac](https://github.com/odevine/edh-tracker/commit/b8701acf8f6e678b6d6afca3db8735840c1cf46d))
* update testData scripts to reflect format type changes ([e8fa3c6](https://github.com/odevine/edh-tracker/commit/e8fa3c6d3f7b3b19bbb65ce401ea6a354b261f31))
* update wording of access request message ([65b20ec](https://github.com/odevine/edh-tracker/commit/65b20ec102bd6404491a5cfca10c61aaada1d37d))
* use correct build command during deploy ([354674a](https://github.com/odevine/edh-tracker/commit/354674a2f7edf04fb8cca8c9c30b3699e8eb0bfc))


### Miscellaneous Chores

* release 1.2.2 ([a075040](https://github.com/odevine/edh-tracker/commit/a075040ea7340a042926f32e8d8fb13a0eecc346))
* release 1.2.3 ([62e2b72](https://github.com/odevine/edh-tracker/commit/62e2b72159b028997996d68dd5edd26fe7eded24))
* release 1.3.1 ([3aa0eda](https://github.com/odevine/edh-tracker/commit/3aa0eda0eeb86f860a2226a89a0f1cd4aca8579b))
* release 1.4.2 ([68a6481](https://github.com/odevine/edh-tracker/commit/68a6481e6831f55fd6df3941595acd8470b44409))
* release 2.0.0 ([68a6481](https://github.com/odevine/edh-tracker/commit/68a6481e6831f55fd6df3941595acd8470b44409))

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
