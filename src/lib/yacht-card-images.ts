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
  "c::7579668770::vessel::d5cc776d-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cc776d-fe8c-11ed-889f-43d4bb723744::assets::ad8f0dc0-d480-11ee-bd01-79d2e467c3d7.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cc776d-fe8c-11ed-889f-43d4bb723744::assets::a4c1c9d0-d480-11ee-bd01-79d2e467c3d7.jpeg/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::7819298091::vessel::d5cca18e-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7819298091::vessel::d5cca18e-fe8c-11ed-889f-43d4bb723744::assets::5ca2c680-bbf1-11f1-8c65-59a18b71ca34/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7819298091::vessel::d5cca18e-fe8c-11ed-889f-43d4bb723744::assets::cc63e210-a006-11ee-ad56-b1760ad54800.jpeg/{imageVariant}",
    "width": 320,
    "height": 200
  },
  "c::7819298091::vessel::cd66c990-4daa-11f0-b066-3b46323f3e3a": {
    "sourceHero": "/media/media::image::c::7819298091::vessel::cd66c990-4daa-11f0-b066-3b46323f3e3a::assets::d6a69b20-bb40-11f1-98a9-17913f3fc303/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::cd66c990-4daa-11f0-b066-3b46323f3e3a::assets::6c28f5b0-4dad-11f0-9416-d3544ae56d9d/{imageVariant}",
    "width": 320,
    "height": 206
  },
  "c::19057409635::vessel::d7e9f070-ccd4-11ee-81c2-b375d968d73a": {
    "sourceHero": "/media/media::image::a::vessel::d7e9f070-ccd4-11ee-81c2-b375d968d73a::assets::6279b8d0-0404-11f0-8163-271a08cfa9a1/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d7e9f070-ccd4-11ee-81c2-b375d968d73a::assets::626daae0-0404-11f0-8163-271a08cfa9a1/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7580658963::vessel::d5cbfb80-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cbfb80-fe8c-11ed-889f-43d4bb723744::assets::58b87cd0-118a-11f0-878b-2b20a320d243/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cbfb80-fe8c-11ed-889f-43d4bb723744::assets::58bb8a10-118a-11f0-bcc3-4be87842cd3e/{imageVariant}",
    "width": 320,
    "height": 160
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
  "c::9333032772::vessel::f5804320-5043-11f0-8976-97a6b7238df8": {
    "sourceHero": "/media/media::image::a::vessel::f5804320-5043-11f0-8976-97a6b7238df8::assets::fd85f480-5047-11f0-8e92-c133a64c50ce/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::f5804320-5043-11f0-8976-97a6b7238df8::assets::fd91db60-5047-11f0-8e92-c133a64c50ce/{imageVariant}",
    "width": 320,
    "height": 213
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
  "c::7580658963::vessel::d5cc4d8e-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cc4d8e-fe8c-11ed-889f-43d4bb723744::assets::a42aeec0-1458-11f0-bebb-fbded6db6b09/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cc4d8e-fe8c-11ed-889f-43d4bb723744::assets::a4219ff0-1458-11f0-beb9-fbded6db6b09/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::18231584005::vessel::21aeaf37-6727-11ee-ba46-d3cdf96e9da3": {
    "sourceHero": "/media/media::image::a::vessel::21aeaf37-6727-11ee-ba46-d3cdf96e9da3::assets::2a414df0-b7f8-11ef-8b2c-7f150bc57324/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::21aeaf37-6727-11ee-ba46-d3cdf96e9da3::assets::2a072b20-b7f8-11ef-8b2c-7f150bc57324/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::25879711825::vessel::d5cca41b-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cca41b-fe8c-11ed-889f-43d4bb723744::assets::e302cce0-2041-11f0-a945-77b0d51cf73b/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cca41b-fe8c-11ed-889f-43d4bb723744::assets::e307d5f0-2041-11f0-a946-77b0d51cf73b/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7819143053::vessel::d5cca4e2-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7819143053::vessel::d5cca4e2-fe8c-11ed-889f-43d4bb723744::assets::8f9a6580-ae28-11ef-b9cf-0b68bb16d7a7/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7819143053::vessel::d5cca4e2-fe8c-11ed-889f-43d4bb723744::assets::5b0ea2e0-17b5-11ef-9ec4-e5b26b68242a.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7646090758::vessel::57081570-5b0f-11f0-92ff-77be2b6bc560": {
    "sourceHero": "/media/media::image::a::vessel::57081570-5b0f-11f0-92ff-77be2b6bc560::assets::f1c39eb0-5b17-11f0-8013-4be366789208/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::57081570-5b0f-11f0-92ff-77be2b6bc560::assets::f1c32980-5b17-11f0-8013-4be366789208/{imageVariant}",
    "width": 320,
    "height": 180
  },
  "c::7579668770::vessel::34a65990-fca3-11ee-ad26-6f560b16d431": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::34a65990-fca3-11ee-ad26-6f560b16d431::assets::f4d09440-fcbe-11ee-aedf-eb61a6140f65.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::34a65990-fca3-11ee-ad26-6f560b16d431::assets::019689a0-fcbf-11ee-aedf-eb61a6140f65.jpeg/{imageVariant}",
    "width": 320,
    "height": 168
  },
  "c::14936947025::vessel::7377db80-0576-11f0-9c37-abbff37a1f97": {
    "sourceHero": "/media/media::image::a::vessel::7377db80-0576-11f0-9c37-abbff37a1f97::assets::794cbfa0-0579-11f0-89dc-1d1a3651f525/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::7377db80-0576-11f0-9c37-abbff37a1f97::assets::794dd110-0579-11f0-a276-9d8b97092625/{imageVariant}",
    "width": 320,
    "height": 239
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
  "c::7579668770::vessel::d5cbfb64-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cbfb64-fe8c-11ed-889f-43d4bb723744::assets::c18930e0-212b-11f1-b37d-d113c7809308/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cbfb64-fe8c-11ed-889f-43d4bb723744::assets::4a39c9c0-5464-11f1-86b8-c9403575e716/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::7579668770::vessel::15f919a0-071c-11ef-b666-339f0ecfacba": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::15f919a0-071c-11ef-b666-339f0ecfacba::assets::ea02c210-450f-11ef-824e-47346050fd70.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::15f919a0-071c-11ef-b666-339f0ecfacba::assets::ea024ce0-450f-11ef-824e-47346050fd70.jpeg/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::8183534776::vessel::221c97b0-19f0-11f0-a2b6-6fe70097e9f6": {
    "sourceHero": "/media/media::image::c::8183534776::vessel::221c97b0-19f0-11f0-a2b6-6fe70097e9f6::assets::01d7f680-2b1a-11f0-897d-592c33c865e9/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8183534776::vessel::221c97b0-19f0-11f0-a2b6-6fe70097e9f6::assets::01db2ad0-2b1a-11f0-897d-592c33c865e9/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579706445::vessel::d5ca2335-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5ca2335-fe8c-11ed-889f-43d4bb723744::assets::c5965b90-aef5-11ee-9868-0f9e38cf8cc4.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5ca2335-fe8c-11ed-889f-43d4bb723744::assets::d4f67bb0-08b9-11ef-aa59-b5f620c38e71.jpeg/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::9938368400::vessel::95cbc8b0-4f7e-11f1-9abb-7d622bde8437": {
    "sourceHero": "/media/media::image::a::vessel::95cbc8b0-4f7e-11f1-9abb-7d622bde8437::assets::a0d7a010-4f80-11f1-8b3d-7b47b1daf5ca/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::95cbc8b0-4f7e-11f1-9abb-7d622bde8437::assets::a0f75d10-4f80-11f1-8b3d-7b47b1daf5ca/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::17949224288::vessel::d5cae6f1-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cae6f1-fe8c-11ed-889f-43d4bb723744::assets::yacht-image-56620-full-5_734864_jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cae6f1-fe8c-11ed-889f-43d4bb723744::assets::yacht-image-56611-full-hero_hero_779214_jpg/{imageVariant}",
    "width": 320,
    "height": 121
  },
  "c::7819198774::vessel::15b1be20-fd5d-11ee-9d97-e36c13889da0": {
    "sourceHero": "/media/media::image::c::7819198774::vessel::15b1be20-fd5d-11ee-9d97-e36c13889da0::assets::0d281250-a081-11ef-a859-a3e340adc58d/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7819198774::vessel::15b1be20-fd5d-11ee-9d97-e36c13889da0::assets::8cf916c0-a07f-11ef-a7e9-1dee5f3e7e18/{imageVariant}",
    "width": 320,
    "height": 239
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
  "c::18277099312::vessel::d5cc4e2e-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cc4e2e-fe8c-11ed-889f-43d4bb723744::assets::5962d920-a838-11ef-ba06-8bbb44286dc2/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cc4e2e-fe8c-11ed-889f-43d4bb723744::assets::59c59290-a838-11ef-ba06-8bbb44286dc2/{imageVariant}",
    "width": 320,
    "height": 210
  },
  "c::7579706445::vessel::d5cb8413-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cb8413-fe8c-11ed-889f-43d4bb723744::assets::ddea94c0-a0bf-11ee-872f-3f22bf78c943.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cb8413-fe8c-11ed-889f-43d4bb723744::assets::c4f26910-a0c0-11ee-872f-3f22bf78c943.jpeg/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::8183534776::vessel::d5cc4fae-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cc4fae-fe8c-11ed-889f-43d4bb723744::assets::K8HYDnTPMb.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cc4fae-fe8c-11ed-889f-43d4bb723744::assets::yachts-100256-XZm_p42MG1.jpg/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::18231584005::vessel::d5c986b9-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5c986b9-fe8c-11ed-889f-43d4bb723744::assets::yachts-101210-IOuAKPglT.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5c986b9-fe8c-11ed-889f-43d4bb723744::assets::6f13b960-b89b-11ef-ab42-dfbf4a30ebef/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::10544830385::vessel::d6d42980-90ba-11ef-a947-0f49700f3c90": {
    "sourceHero": "/media/media::image::a::vessel::d6d42980-90ba-11ef-a947-0f49700f3c90::assets::8d324a80-4075-11f0-9274-5f7d45340aae/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d6d42980-90ba-11ef-a947-0f49700f3c90::assets::8d23cb91-4075-11f0-9274-5f7d45340aae/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::7580644256::vessel::d5cccc04-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7580644256::vessel::d5cccc04-fe8c-11ed-889f-43d4bb723744::assets::84fdd590-c587-11f0-bb3d-73a53b4531f2/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7580644256::vessel::d5cccc04-fe8c-11ed-889f-43d4bb723744::assets::84fceb31-c587-11f0-bb3d-73a53b4531f2/{imageVariant}",
    "width": 320,
    "height": 180
  },
  "c::10095349510::vessel::d5cbab88-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::10095349510::vessel::d5cbab88-fe8c-11ed-889f-43d4bb723744::assets::3729e0b0-d7c3-11ee-9b9c-b77da7f38494.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::10095349510::vessel::d5cbab88-fe8c-11ed-889f-43d4bb723744::assets::4b308690-d7c3-11ee-9b9c-b77da7f38494.jpeg/{imageVariant}",
    "width": 320,
    "height": 426
  },
  "c::7579706445::vessel::d5cbfbc6-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cbfbc6-fe8c-11ed-889f-43d4bb723744::assets::bc2edb90-a0e0-11ee-a388-a56194374e5e.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cbfbc6-fe8c-11ed-889f-43d4bb723744::assets::bda0e220-a0e0-11ee-a388-a56194374e5e.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::8344947358::vessel::d5cbfaf5-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cbfaf5-fe8c-11ed-889f-43d4bb723744::assets::3gfvEHufI.png/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cbfaf5-fe8c-11ed-889f-43d4bb723744::assets::a3a668f0-9d19-11ef-ad2e-c59ee20693fb/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579706445::vessel::d5cc25af-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cc25af-fe8c-11ed-889f-43d4bb723744::assets::Z61s5njmh.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cc25af-fe8c-11ed-889f-43d4bb723744::assets::yachts-7579-fuuM_gfK9.jpg/{imageVariant}",
    "width": 2000,
    "height": 1500
  },
  "c::26934280528::vessel::b9ef1550-a952-11ee-9d0b-df76e04db727": {
    "sourceHero": "/media/media::image::a::vessel::b9ef1550-a952-11ee-9d0b-df76e04db727::assets::2b82a290-1ca1-11f1-a623-e9d989858b83/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::b9ef1550-a952-11ee-9d0b-df76e04db727::assets::fe2838f0-1ca0-11f1-a623-e9d989858b83/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::8193426698::vessel::7b6841d0-dc96-11ef-b49b-99d9d26f6ef8": {
    "sourceHero": "/media/media::image::c::8193426698::vessel::7b6841d0-dc96-11ef-b49b-99d9d26f6ef8::assets::117b7840-9df8-11f0-8477-4bbec54bf4be/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8193426698::vessel::7b6841d0-dc96-11ef-b49b-99d9d26f6ef8::assets::1179a380-9df8-11f0-85ac-112280abf446/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7819307041::vessel::89a82460-ca14-11f0-bf4c-7b47720e3a29": {
    "sourceHero": "/media/media::image::a::vessel::89a82460-ca14-11f0-bf4c-7b47720e3a29::assets::7b9953f0-ca17-11f0-8039-158b7d9f768f/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::89a82460-ca14-11f0-bf4c-7b47720e3a29::assets::7b997b00-ca17-11f0-8039-158b7d9f768f/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579706445::vessel::e09b6ae0-0bea-11f0-afa7-db2176be0d91": {
    "sourceHero": "/media/media::image::a::vessel::e09b6ae0-0bea-11f0-afa7-db2176be0d91::assets::7cd003c0-0bec-11f0-a0ba-abcc88f4b51d/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::e09b6ae0-0bea-11f0-afa7-db2176be0d91::assets::7cbd3f10-0bec-11f0-a0ba-abcc88f4b51d/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::43848437628::vessel::654f91a0-16d3-11f1-bf85-c96cd18f6bb4": {
    "sourceHero": "/media/media::image::a::vessel::654f91a0-16d3-11f1-bf85-c96cd18f6bb4::assets::8debe4b0-16d8-11f1-bcb9-e549bbdb8263/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::654f91a0-16d3-11f1-bf85-c96cd18f6bb4::assets::8df44920-16d8-11f1-8b34-4dea6550368b/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579668770::vessel::d5cccc7e-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cccc7e-fe8c-11ed-889f-43d4bb723744::assets::c2d73fa0-a9d5-11f0-b9bb-8d72aa2809be/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cccc7e-fe8c-11ed-889f-43d4bb723744::assets::ca48eb30-a9d5-11f0-b9bb-8d72aa2809be/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::7579668770::vessel::d5cc2591-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cc2591-fe8c-11ed-889f-43d4bb723744::assets::b7af3770-320a-11ef-9530-ef8e9cbda1dc.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cc2591-fe8c-11ed-889f-43d4bb723744::assets::58f7cb60-3f76-11ef-9dad-7944beed4bcc.jpeg/{imageVariant}",
    "width": 320,
    "height": 160
  },
  "c::8183534776::vessel::2fb44640-436b-11ef-9499-abe403c7e24f": {
    "sourceHero": "/media/media::image::a::vessel::2fb44640-436b-11ef-9499-abe403c7e24f::assets::e77c72c0-48e8-11ef-850d-b9b82b7a7922.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::2fb44640-436b-11ef-9499-abe403c7e24f::assets::e77a76f0-48e8-11ef-850d-b9b82b7a7922.jpeg/{imageVariant}",
    "width": 320,
    "height": 240
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
  "c::30973779271::vessel::c6d59bc0-d0f8-11f0-97db-753c2df5ff29": {
    "sourceHero": "/media/media::image::a::vessel::c6d59bc0-d0f8-11f0-97db-753c2df5ff29::assets::d860dd30-d0ff-11f0-8dea-4710a9d63e2f/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::c6d59bc0-d0f8-11f0-97db-753c2df5ff29::assets::d8632720-d0ff-11f0-8dea-4710a9d63e2f/{imageVariant}",
    "width": 320,
    "height": 251
  },
  "c::7579706445::vessel::d5cbab71-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cbab71-fe8c-11ed-889f-43d4bb723744::assets::35368df0-a346-11ee-aa88-e577ce1d9797.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cbab71-fe8c-11ed-889f-43d4bb723744::assets::3909dd10-a346-11ee-aa88-e577ce1d9797.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579706445::vessel::d5cbfb3d-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cbfb3d-fe8c-11ed-889f-43d4bb723744::assets::afb6e220-a330-11ee-aa88-e577ce1d9797.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cbfb3d-fe8c-11ed-889f-43d4bb723744::assets::b55ea320-a330-11ee-aa88-e577ce1d9797.jpeg/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::7579706445::vessel::38cb9010-43ae-11ef-b3ab-f3f0ef91fbca": {
    "sourceHero": "/media/media::image::a::vessel::38cb9010-43ae-11ef-b3ab-f3f0ef91fbca::assets::0e2424a0-d5d7-11f0-a7b8-6b49861716e1/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::38cb9010-43ae-11ef-b3ab-f3f0ef91fbca::assets::0e29c9f0-d5d7-11f0-8d25-7f7501f9117f/{imageVariant}",
    "width": 320,
    "height": 220
  },
  "c::7579706445::vessel::d5cc4d17-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cc4d17-fe8c-11ed-889f-43d4bb723744::assets::pjAq2J0hJ.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cc4d17-fe8c-11ed-889f-43d4bb723744::assets::yachts-4419-LbvWNza0M.jpg/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::18231584005::vessel::fa1c9cb0-7ea8-11f0-8fc2-538c36c1fd23": {
    "sourceHero": "/media/media::image::a::vessel::fa1c9cb0-7ea8-11f0-8fc2-538c36c1fd23::assets::280e35e0-7eac-11f0-ab5c-cb801cb91999/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::fa1c9cb0-7ea8-11f0-8fc2-538c36c1fd23::assets::28186f10-7eac-11f0-bad8-ef3d759c2edc/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::10244694328::vessel::4b2a0b20-7e64-11ee-b353-45ccf65feac5": {
    "sourceHero": "/media/media::image::a::vessel::4b2a0b20-7e64-11ee-b353-45ccf65feac5::assets::ab0cb2a0-b990-11ef-bd33-835e2369dbe4/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::4b2a0b20-7e64-11ee-b353-45ccf65feac5::assets::806b7590-b990-11ef-ba5e-039e225accaa/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::8193426698::vessel::423b5880-b981-11ef-9550-d325a0c4dbe8": {
    "sourceHero": "/media/media::image::c::8193426698::vessel::423b5880-b981-11ef-9550-d325a0c4dbe8::assets::9578bef0-9d57-11f1-99d7-0b6324047659/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8193426698::vessel::423b5880-b981-11ef-9550-d325a0c4dbe8::assets::957897e0-9d57-11f1-99d7-0b6324047659/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::21222387982::vessel::77943144-486c-11ee-a45f-fdfff6163a60": {
    "sourceHero": "/media/media::image::a::vessel::77943144-486c-11ee-a45f-fdfff6163a60::assets::c419d5f0-a2d4-11f1-9801-c7d3031893b5/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::77943144-486c-11ee-a45f-fdfff6163a60::assets::c420dad0-a2d4-11f1-9801-c7d3031893b5/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::21222387982::vessel::7793e2e7-486c-11ee-a45f-fdfff6163a60": {
    "sourceHero": "/media/media::image::a::vessel::7793e2e7-486c-11ee-a45f-fdfff6163a60::assets::a710b910-e89b-11ee-b70c-9bcd766deee9.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::7793e2e7-486c-11ee-a45f-fdfff6163a60::assets::225e2e00-a2d4-11f1-b48c-67fb1824a8c4/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::21222387982::vessel::78f27c00-7e68-11ee-b353-45ccf65feac5": {
    "sourceHero": "/media/media::image::c::21222387982::vessel::78f27c00-7e68-11ee-b353-45ccf65feac5::assets::9fad9320-3560-11ef-8e27-d52d0bbcf4ce.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::21222387982::vessel::78f27c00-7e68-11ee-b353-45ccf65feac5::assets::dcfac810-3560-11ef-8e27-d52d0bbcf4ce.jpeg/{imageVariant}",
    "width": 320,
    "height": 180
  },
  "c::29886948373::vessel::ddbce610-64b4-11ef-8538-adc7c59b2b56": {
    "sourceHero": "/media/media::image::a::vessel::ddbce610-64b4-11ef-8538-adc7c59b2b56::assets::75eb62c0-f2ce-11ef-8b24-ff0979fe66f3/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::ddbce610-64b4-11ef-8538-adc7c59b2b56::assets::75ec4d20-f2ce-11ef-8219-a7e031e0afe2/{imageVariant}",
    "width": 320,
    "height": 568
  },
  "c::10095349510::vessel::3e419cb0-d7d4-11ee-adf5-e5557b550dbf": {
    "sourceHero": "/media/media::image::c::10095349510::vessel::3e419cb0-d7d4-11ee-adf5-e5557b550dbf::assets::2010ec90-d7d5-11ee-adf5-e5557b550dbf.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::10095349510::vessel::3e419cb0-d7d4-11ee-adf5-e5557b550dbf::assets::55f29070-d7d5-11ee-adf5-e5557b550dbf.jpeg/{imageVariant}",
    "width": 320,
    "height": 180
  },
  "c::7819307041::vessel::d5cca393-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cca393-fe8c-11ed-889f-43d4bb723744::assets::1852f9b1-1ab1-11f0-9e81-09983e5c335e/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cca393-fe8c-11ed-889f-43d4bb723744::assets::1852ab90-1ab1-11f0-9e80-09983e5c335e/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::18240645921::vessel::81419660-b56c-11f0-a56f-29fadbc81b5b": {
    "sourceHero": "/media/media::image::a::vessel::81419660-b56c-11f0-a56f-29fadbc81b5b::assets::ed29eaf0-b56f-11f0-b86a-bdc0f842aab0/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::81419660-b56c-11f0-a56f-29fadbc81b5b::assets::ed2a3910-b56f-11f0-b86a-bdc0f842aab0/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::8275378522::vessel::bb064970-7e57-11ee-a870-0ff0b229787c": {
    "sourceHero": "/media/media::image::c::8275378522::vessel::bb064970-7e57-11ee-a870-0ff0b229787c::assets::ac348c40-7e5c-11ee-a870-0ff0b229787c.png/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::8275378522::vessel::bb064970-7e57-11ee-a870-0ff0b229787c::assets::ad7d11d0-7e5c-11ee-a870-0ff0b229787c.jpeg/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::15406789740::vessel::a167f3a0-7f6a-11ef-b3e5-8795280763d4": {
    "sourceHero": "/media/media::image::c::15406789740::vessel::a167f3a0-7f6a-11ef-b3e5-8795280763d4::assets::89669930-b99a-11f0-8718-2deb9e8026a7/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::15406789740::vessel::a167f3a0-7f6a-11ef-b3e5-8795280763d4::assets::899a5360-b99a-11f0-8718-2deb9e8026a7/{imageVariant}",
    "width": 320,
    "height": 426
  },
  "c::7580663817::vessel::d5cc254f-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7580663817::vessel::d5cc254f-fe8c-11ed-889f-43d4bb723744::assets::15c28c60-aa6e-11ee-b777-93080a056555.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7580663817::vessel::d5cc254f-fe8c-11ed-889f-43d4bb723744::assets::166d4b50-aa6e-11ee-b777-93080a056555.jpeg/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::18231584005::vessel::f70ea0d0-a4f1-11f0-9e4b-4d613f86d6cc": {
    "sourceHero": "/media/media::image::a::vessel::f70ea0d0-a4f1-11f0-9e4b-4d613f86d6cc::assets::041efdf0-a4f8-11f0-b024-3f1d7df60d3e/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::f70ea0d0-a4f1-11f0-9e4b-4d613f86d6cc::assets::ed542470-a4f6-11f0-966a-1124682337de/{imageVariant}",
    "width": 320,
    "height": 240
  },
  "c::18231584005::vessel::77940a04-486c-11ee-a45f-fdfff6163a60": {
    "sourceHero": "/media/media::image::a::vessel::77940a04-486c-11ee-a45f-fdfff6163a60::assets::3825e710-88aa-11ee-a31d-bfa3cf24fef8.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::77940a04-486c-11ee-a45f-fdfff6163a60::assets::382598f0-88aa-11ee-a31d-bfa3cf24fef8.jpeg/{imageVariant}",
    "width": 2500,
    "height": 1571
  },
  "c::30662703947::vessel::fc5f7100-bc7a-11ef-a23b-0feec8e96c56": {
    "sourceHero": "/media/media::image::a::vessel::fc5f7100-bc7a-11ef-a23b-0feec8e96c56::assets::5d4c08e0-bc7e-11ef-a8c3-f3c2479af11d/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::fc5f7100-bc7a-11ef-a23b-0feec8e96c56::assets::5d6cd750-bc7e-11ef-a8c3-f3c2479af11d/{imageVariant}",
    "width": 320,
    "height": 177
  },
  "c::22672890147::vessel::01a262d0-f2e4-11f0-a55a-d5c007b21ce5": {
    "sourceHero": "/media/media::image::a::vessel::01a262d0-f2e4-11f0-a55a-d5c007b21ce5::assets::0bd71740-f2ea-11f0-8659-e12187d45177/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::01a262d0-f2e4-11f0-a55a-d5c007b21ce5::assets::0bdbd230-f2ea-11f0-865a-e12187d45177/{imageVariant}",
    "width": 320,
    "height": 179
  },
  "c::17790280022::vessel::d590ff90-a0d2-11ee-b505-fd3fb38a1bdd": {
    "sourceHero": "/media/media::image::c::17790280022::vessel::d590ff90-a0d2-11ee-b505-fd3fb38a1bdd::assets::65909110-a0d7-11ee-a812-f30aa7659472.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::17790280022::vessel::d590ff90-a0d2-11ee-b505-fd3fb38a1bdd::assets::165b5080-a0d7-11ee-814a-b32d6daafbfe.jpeg/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::9429269944::vessel::d5cc2542-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::9429269944::vessel::d5cc2542-fe8c-11ed-889f-43d4bb723744::assets::079ca9a0-2835-11ef-b2be-d75cb554daa2.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::9429269944::vessel::d5cc2542-fe8c-11ed-889f-43d4bb723744::assets::079c5b80-2835-11ef-b2be-d75cb554daa2.jpeg/{imageVariant}",
    "width": 320,
    "height": 480
  },
  "c::7579706445::vessel::d5cc4e71-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579706445::vessel::d5cc4e71-fe8c-11ed-889f-43d4bb723744::assets::7051e320-a414-11ee-a3ef-0b2547cdbcf3.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579706445::vessel::d5cc4e71-fe8c-11ed-889f-43d4bb723744::assets::72dcfad0-a414-11ee-a3ef-0b2547cdbcf3.jpeg/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::18231584005::vessel::d5cbabc6-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cbabc6-fe8c-11ed-889f-43d4bb723744::assets::MJZ2GgMXL.png/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cbabc6-fe8c-11ed-889f-43d4bb723744::assets::7b6e6230-b93d-11ef-9ce9-e3cf8f6660f2/{imageVariant}",
    "width": 320,
    "height": 213
  },
  "c::7579706445::vessel::23b283e0-8559-11ef-8860-43af137a6273": {
    "sourceHero": "/media/media::image::a::vessel::23b283e0-8559-11ef-8860-43af137a6273::assets::6e2840f0-0bea-11f0-9791-91c21cb4d62d/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::23b283e0-8559-11ef-8860-43af137a6273::assets::6e2a3cc1-0bea-11f0-9792-91c21cb4d62d/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::18230515995::vessel::0d902de0-7e45-11ee-b67b-fb38e676a8ad": {
    "sourceHero": "/media/media::image::c::18230515995::vessel::0d902de0-7e45-11ee-b67b-fb38e676a8ad::assets::79ea9030-df18-11f0-9c63-5375d309f5ab/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::18230515995::vessel::0d902de0-7e45-11ee-b67b-fb38e676a8ad::assets::79eb0560-df18-11f0-9c64-5375d309f5ab/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::7579668770::vessel::d5cbfbf3-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::c::7579668770::vessel::d5cbfbf3-fe8c-11ed-889f-43d4bb723744::assets::32ac7c30-12da-11ef-8a22-53421d5f5d06.jpeg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::7579668770::vessel::d5cbfbf3-fe8c-11ed-889f-43d4bb723744::assets::_4cND8gsc.jpg/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::19057481779::vessel::a69b8070-1d3f-11f1-856b-dd024e10e2b6": {
    "sourceHero": "/media/media::image::a::vessel::a69b8070-1d3f-11f1-856b-dd024e10e2b6::assets::cd68dab0-1d56-11f1-a4b8-bbba338af259/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::c::19057481779::vessel::a69b8070-1d3f-11f1-856b-dd024e10e2b6::assets::b004e9d0-1dee-11f1-9b85-3dfaad3a3292/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::8275378522::vessel::5dc90960-dcf1-11ef-a54d-2d129dec3260": {
    "sourceHero": "/media/media::image::a::vessel::5dc90960-dcf1-11ef-a54d-2d129dec3260::assets::5d78dba0-dcf3-11ef-82dc-7159f8120ef0/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::5dc90960-dcf1-11ef-a54d-2d129dec3260::assets::4c433010-dcf3-11ef-82dc-7159f8120ef0/{imageVariant}",
    "width": 320,
    "height": 239
  },
  "c::7819307041::vessel::d5cca390-fe8c-11ed-889f-43d4bb723744": {
    "sourceHero": "/media/media::image::a::vessel::d5cca390-fe8c-11ed-889f-43d4bb723744::assets::yachts-100317-Yla1wM7Gz.jpg/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::d5cca390-fe8c-11ed-889f-43d4bb723744::assets::34824670-1aae-11f0-9592-3f5d0dbf1c14/{imageVariant}",
    "width": 320,
    "height": 256
  },
  "c::8193426698::vessel::7793e2e3-486c-11ee-a45f-fdfff6163a60": {
    "sourceHero": "/media/media::image::a::vessel::7793e2e3-486c-11ee-a45f-fdfff6163a60::assets::4c368e70-da99-11ef-8f50-5702a5cf2a37/{imageVariant}",
    "image": "https://api.ankor.io/media/media::image::a::vessel::7793e2e3-486c-11ee-a45f-fdfff6163a60::assets::4c5b5480-da99-11ef-8f50-5702a5cf2a37/{imageVariant}",
    "width": 320,
    "height": 426
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
