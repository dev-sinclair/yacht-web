import type { YachtCard } from "../data/types/yacht";

// Selected from each yacht's own gallery during the October 2026 catalogue review.
// Key by vessel identity, and stop overriding when the provider changes its hero.
interface CardImageSelection {
  sourceHero: string;
  image: string;
  width: number;
  height: number;
}

const selections: Record<string, CardImageSelection> = {
  "c::8864389904::vessel::d5cca304-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::8864389904::vessel::d5cca304-fe8c-11ed-889f-43d4bb723744::assets::38954a90-d5e1-11ee-b448-d3d1ccf3fccd.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8864389904::vessel::d5cca304-fe8c-11ed-889f-43d4bb723744::assets::388ee1f0-d5e1-11ee-b448-d3d1ccf3fccd.jpeg/{imageVariant}",
    "width": 320,
    "height": 235
  },
  "c::19286405998::vessel::d5cca207-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::19286405998::vessel::d5cca207-fe8c-11ed-889f-43d4bb723744::assets::792e2400-4c5a-11f0-bf5d-333103e49cc4/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::19286405998::vessel::d5cca207-fe8c-11ed-889f-43d4bb723744::assets::47027060-46c1-11f0-801d-55036f65bce6/{imageVariant}",
    "width": 320,
    "height": 206
  },
  "c::8573887147::vessel::d5c9fc06-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::8573887147::vessel::d5c9fc06-fe8c-11ed-889f-43d4bb723744::assets::ea2428c0-2cd1-11ef-a2fd-e99020cca074.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8573887147::vessel::d5c9fc06-fe8c-11ed-889f-43d4bb723744::assets::ea264ba0-2cd1-11ef-a2fd-e99020cca074.jpeg/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::10923570597::vessel::18ebe080-bdfa-11ef-866a-ad7f2dece8ef": {
    "sourceHero": "/media/media::image::a::vessel::18ebe080-bdfa-11ef-866a-ad7f2dece8ef::assets::4c2bec90-bdfc-11ef-b346-8978585c2c4e/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::18ebe080-bdfa-11ef-866a-ad7f2dece8ef::assets::6b099e30-bdfe-11ef-97eb-e9932d26afea/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::7579684728::vessel::d5cc7968-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579684728::vessel::d5cc7968-fe8c-11ed-889f-43d4bb723744::assets::0a41ddb0-3d42-11f0-924d-39e47bdcc231/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579684728::vessel::d5cc7968-fe8c-11ed-889f-43d4bb723744::assets::0a433d40-3d42-11f0-924d-39e47bdcc231/{imageVariant}",
    "width": 320,
    "height": 189
  },
  "c::32138693437::vessel::d5cb83d9-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cb83d9-fe8c-11ed-889f-43d4bb723744::assets::bfac63b0-34e0-11f0-b6ac-c9b9e6e80da9/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cb83d9-fe8c-11ed-889f-43d4bb723744::assets::bf7f8750-34e0-11f0-b345-1f934cdc304e/{imageVariant}",
    "width": 320,
    "height": 214
  },
  "c::7580644139::vessel::d5cc24f9-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7580644139::vessel::d5cc24f9-fe8c-11ed-889f-43d4bb723744::assets::d9bf90d0-efc9-11ef-8260-5b0ca54ceb9a/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7580644139::vessel::d5cc24f9-fe8c-11ed-889f-43d4bb723744::assets::d9c11770-efc9-11ef-8260-5b0ca54ceb9a/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::19057409635::vessel::d7e9f070-ccd4-11ee-81c2-b375d968d73a": {
    "sourceHero": "/media/media::image::a::vessel::d7e9f070-ccd4-11ee-81c2-b375d968d73a::assets::6279b8d0-0404-11f0-8163-271a08cfa9a1/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d7e9f070-ccd4-11ee-81c2-b375d968d73a::assets::626daae0-0404-11f0-8163-271a08cfa9a1/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::20269138295::vessel::6f8ff1f0-e56b-11ee-9994-89f6645ea386": {
    "sourceHero": "/media/media::image::c::20269138295::vessel::6f8ff1f0-e56b-11ee-9994-89f6645ea386::assets::0d439880-3ef8-11ef-8864-9fc69006735a.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::20269138295::vessel::6f8ff1f0-e56b-11ee-9994-89f6645ea386::assets::21d47d00-3ef8-11ef-8864-9fc69006735a.jpeg/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::7819298091::vessel::d5cabfd0-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7819298091::vessel::d5cabfd0-fe8c-11ed-889f-43d4bb723744::assets::7d2a92c0-a01a-11ee-b3e1-f14ea511c2a0.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7819298091::vessel::d5cabfd0-fe8c-11ed-889f-43d4bb723744::assets::56a6a620-a01a-11ee-b3e1-f14ea511c2a0.jpeg/{imageVariant}",
    "width": 320,
    "height": 187
  },
  "c::13745145528::vessel::d5cc79bb-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::13745145528::vessel::d5cc79bb-fe8c-11ed-889f-43d4bb723744::assets::5vCeIhQNa.png/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::13745145528::vessel::d5cc79bb-fe8c-11ed-889f-43d4bb723744::assets::yachts-3123-vCl7MgVeA.png/{imageVariant}",
    "width": 1600,
    "height": 899
  },
  "c::7580644139::vessel::d5cbfc1f-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7580644139::vessel::d5cbfc1f-fe8c-11ed-889f-43d4bb723744::assets::f985cab0-1914-11ef-a4a2-df0c75334a61.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7580644139::vessel::d5cbfc1f-fe8c-11ed-889f-43d4bb723744::assets::29d83ea0-1915-11ef-a4a2-df0c75334a61.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::19057409635::vessel::d5cc2502-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::19057409635::vessel::d5cc2502-fe8c-11ed-889f-43d4bb723744::assets::517f25b0-bcd1-11f1-a7e2-f5aa3364e763/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::19057409635::vessel::d5cc2502-fe8c-11ed-889f-43d4bb723744::assets::517bca50-bcd1-11f1-a7df-f5aa3364e763/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::35182310185::vessel::17ffe080-ba3a-11f0-9548-87d5452668cc": {
    "sourceHero": "/media/media::image::a::vessel::17ffe080-ba3a-11f0-9548-87d5452668cc::assets::0b580f90-ba3c-11f0-94a0-85f229bd049e/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::17ffe080-ba3a-11f0-9548-87d5452668cc::assets::0b60e930-ba3c-11f0-94a0-85f229bd049e/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::15746043527::vessel::9520bce0-a0cb-11ee-a424-e7fecd9db876": {
    "sourceHero": "/media/media::image::c::15746043527::vessel::9520bce0-a0cb-11ee-a424-e7fecd9db876::assets::f5e85280-a0cc-11ee-a424-e7fecd9db876.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::15746043527::vessel::9520bce0-a0cb-11ee-a424-e7fecd9db876::assets::f5ea7560-a0cc-11ee-a424-e7fecd9db876.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::8864389904::vessel::d5cc7960-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::8864389904::vessel::d5cc7960-fe8c-11ed-889f-43d4bb723744::assets::yacht-image-58660-full-chaos_sydney_jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8864389904::vessel::d5cc7960-fe8c-11ed-889f-43d4bb723744::assets::yacht-image-58661-full-chaos_sydney_jpg/{imageVariant}",
    "width": 320,
    "height": 212
  },
  "c::18402418711::vessel::d5cc7a59-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cc7a59-fe8c-11ed-889f-43d4bb723744::assets::7eaac0e0-9599-11f0-a810-5704f4f8be43/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cc7a59-fe8c-11ed-889f-43d4bb723744::assets::7ec351f0-9599-11f0-a810-5704f4f8be43/{imageVariant}",
    "width": 320,
    "height": 180
  },
  "c::7580644139::vessel::d5cccd34-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7580644139::vessel::d5cccd34-fe8c-11ed-889f-43d4bb723744::assets::yachts-2446-e1e4fsspy.png/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7580644139::vessel::d5cccd34-fe8c-11ed-889f-43d4bb723744::assets::609ed960-1917-11ef-a4a2-df0c75334a61.webp/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::19057409635::vessel::87ef5e00-f279-11ee-a4c1-b77de0b494d6": {
    "sourceHero": "/media/media::image::c::19057409635::vessel::87ef5e00-f279-11ee-a4c1-b77de0b494d6::assets::10d8efc1-bd97-11f1-93da-2925847c2e96/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::19057409635::vessel::87ef5e00-f279-11ee-a4c1-b77de0b494d6::assets::10d964f0-bd97-11f1-93da-2925847c2e96/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::8164602117::vessel::d5cc4fad-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cc4fad-fe8c-11ed-889f-43d4bb723744::assets::d73d00e0-f438-11ef-870f-a3ca3892ed79/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8164602117::vessel::d5cc4fad-fe8c-11ed-889f-43d4bb723744::assets::27c00b80-777d-11f0-a152-d9c58f418839/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::10819594065::vessel::9928a930-201b-11f0-a24c-e5a2f59a88ff": {
    "sourceHero": "/media/media::image::a::vessel::9928a930-201b-11f0-a24c-e5a2f59a88ff::assets::088c8ff0-201f-11f0-b090-37c711c639e2/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::10819594065::vessel::9928a930-201b-11f0-a24c-e5a2f59a88ff::assets::b82c05d0-0b2e-11f1-8d1d-b393be503c53/{imageVariant}",
    "width": 320,
    "height": 180
  },
  "c::7579706445::vessel::3855df30-8943-11ee-988a-b71446e76489": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::3855df30-8943-11ee-988a-b71446e76489::assets::80fe3620-9a79-11f1-baaf-75c9787d12f8/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::3855df30-8943-11ee-988a-b71446e76489::assets::80f116c0-9a79-11f1-baaf-75c9787d12f8/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7819217464::vessel::d5cc24b5-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cc24b5-fe8c-11ed-889f-43d4bb723744::assets::82bf8d40-a378-11f0-8237-07e9117c6be0/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cc24b5-fe8c-11ed-889f-43d4bb723744::assets::82c29a80-a378-11f0-a115-a98937e0d318/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579668770::vessel::d5cc4ddf-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cc4ddf-fe8c-11ed-889f-43d4bb723744::assets::e5a676f0-d7ad-11ee-87f1-bb2a63a2dcd1.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cc4ddf-fe8c-11ed-889f-43d4bb723744::assets::efa1b390-d7ad-11ee-87f1-bb2a63a2dcd1.jpeg/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::7579668770::vessel::d5cb5c97-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cb5c97-fe8c-11ed-889f-43d4bb723744::assets::yachts-4004-AfuGSGMuX.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cb5c97-fe8c-11ed-889f-43d4bb723744::assets::02a39540-53d1-11ef-b376-d978e088662a/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::7579668770::vessel::d5ca98bc-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5ca98bc-fe8c-11ed-889f-43d4bb723744::assets::0a1add60-00ec-11f0-91fc-359707e63b90/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5ca98bc-fe8c-11ed-889f-43d4bb723744::assets::0a2df031-00ec-11f0-91fc-359707e63b90/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::18231584005::vessel::21aeaf37-6727-11ee-ba46-d3cdf96e9da3": {
    "sourceHero": "/media/media::image::a::vessel::21aeaf37-6727-11ee-ba46-d3cdf96e9da3::assets::2a414df0-b7f8-11ef-8b2c-7f150bc57324/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::21aeaf37-6727-11ee-ba46-d3cdf96e9da3::assets::2a072b20-b7f8-11ef-8b2c-7f150bc57324/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::7819143053::vessel::d5cca4e2-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7819143053::vessel::d5cca4e2-fe8c-11ed-889f-43d4bb723744::assets::8f9a6580-ae28-11ef-b9cf-0b68bb16d7a7/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7819143053::vessel::d5cca4e2-fe8c-11ed-889f-43d4bb723744::assets::5b0ea2e0-17b5-11ef-9ec4-e5b26b68242a.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::21392618129::vessel::a49bfe90-d40f-11f0-81c6-75941bd3685b": {
    "sourceHero": "/media/media::image::a::vessel::a49bfe90-d40f-11f0-81c6-75941bd3685b::assets::730bc891-d411-11f0-8e4e-a72fc0c670ca/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::a49bfe90-d40f-11f0-81c6-75941bd3685b::assets::730bc890-d411-11f0-8e4e-a72fc0c670ca/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::9938368400::vessel::bf51e7f0-ccf3-11ef-8f6c-294d9fa20bcf": {
    "sourceHero": "/media/media::image::a::vessel::bf51e7f0-ccf3-11ef-8f6c-294d9fa20bcf::assets::b3ee4e80-4dfd-11f1-bc38-7187380925d9/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::bf51e7f0-ccf3-11ef-8f6c-294d9fa20bcf::assets::b3d4ac00-4dfd-11f1-b95c-25e0bce75777/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::17949224288::vessel::d5cae6f1-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cae6f1-fe8c-11ed-889f-43d4bb723744::assets::yacht-image-56620-full-5_734864_jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cae6f1-fe8c-11ed-889f-43d4bb723744::assets::yacht-image-56611-full-hero_hero_779214_jpg/{imageVariant}",
    "width": 320,
    "height": 121
  },
  "c::8193426698::vessel::8fd2dec0-4379-11ef-9516-27a07d6afb11": {
    "sourceHero": "/media/media::image::a::vessel::8fd2dec0-4379-11ef-9516-27a07d6afb11::assets::1aa55f50-daa1-11ef-86cb-bd3ba8503573/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::8fd2dec0-4379-11ef-9516-27a07d6afb11::assets::1abd5420-daa1-11ef-ae57-69f480bf0e7b/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::7579668770::vessel::e98677f0-83f7-11f0-871d-25f497afe405": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::e98677f0-83f7-11f0-871d-25f497afe405::assets::41ad95d0-73c6-11f1-b0c2-aba7f22fb976/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::e98677f0-83f7-11f0-871d-25f497afe405::assets::41acd280-73c6-11f1-b0c2-aba7f22fb976/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::7819352448::vessel::0cccb900-c3bb-11f1-af03-e7efd17e20e6": {
    "sourceHero": "/media/media::image::a::vessel::0cccb900-c3bb-11f1-af03-e7efd17e20e6::assets::4adc68b0-c3bd-11f1-90fc-fd1c081493e5/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::0cccb900-c3bb-11f1-af03-e7efd17e20e6::assets::f100ff50-c3d9-11f1-a021-cfa5eb2d1f85/{imageVariant}",
    "width": 320,
    "height": 566
  },
  "c::7819240034::vessel::22876d40-2d11-11f0-8387-51325ee31375": {
    "sourceHero": "/media/media::image::c::7819240034::vessel::22876d40-2d11-11f0-8387-51325ee31375::assets::882cce60-37ed-11f0-8ae7-95924ce18bb5/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7819240034::vessel::22876d40-2d11-11f0-8387-51325ee31375::assets::88514650-37ed-11f0-8ae7-95924ce18bb5/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::7579706445::vessel::d5cc4d17-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cc4d17-fe8c-11ed-889f-43d4bb723744::assets::pjAq2J0hJ.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cc4d17-fe8c-11ed-889f-43d4bb723744::assets::yachts-4419-LbvWNza0M.jpg/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::15406789740::vessel::a167f3a0-7f6a-11ef-b3e5-8795280763d4": {
    "sourceHero": "/media/media::image::c::15406789740::vessel::a167f3a0-7f6a-11ef-b3e5-8795280763d4::assets::89669930-b99a-11f0-8718-2deb9e8026a7/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::15406789740::vessel::a167f3a0-7f6a-11ef-b3e5-8795280763d4::assets::899a5360-b99a-11f0-8718-2deb9e8026a7/{imageVariant}",
    "width": 320,
    "height": 426
  },
  "c::18230515995::vessel::0d902de0-7e45-11ee-b67b-fb38e676a8ad": {
    "sourceHero": "/media/media::image::c::18230515995::vessel::0d902de0-7e45-11ee-b67b-fb38e676a8ad::assets::79ea9030-df18-11f0-9c63-5375d309f5ab/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::18230515995::vessel::0d902de0-7e45-11ee-b67b-fb38e676a8ad::assets::79eb0560-df18-11f0-9c64-5375d309f5ab/{imageVariant}",
    "width": 320,
    "height": 239
  }
};

function imageIdentity(url: string): string {
  return url
    .replace(/^https:\/\/api\.ankor\.io/, "")
    .replace(/\/(?:\d+[xw]|\{imageVariant\})(?=[?#]|$)/, "/{imageVariant}");
}

export function getYachtCardImage(yacht: Pick<YachtCard, "uri" | "hero">): CardImageSelection | undefined {
  const selection = selections[yacht.uri];
  return selection && imageIdentity(selection.sourceHero) === imageIdentity(yacht.hero)
    ? selection
    : undefined;
}

/** The provider's width variants preserve the photograph; x variants crop it. */
export function resolveYachtCardImage(url: string | null | undefined, width: 640 | 1280): string {
  if (!url) return "";
  const resolved = url
    .replace(/\/(?:\d+[xw]|\{imageVariant\})(?=[?#]|$)/, `/${width}w`);
  return resolved.startsWith("/") ? `https://api.ankor.io${resolved}` : resolved;
}
