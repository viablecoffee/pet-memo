# pet-memo-unihack-2026

Discussion:

We are doing UNIHACK 2026. After a brief discussion, we want to do an application like 'Pet Memorial Space', so we want to create a Memory Starry Sky. The background of the starry sky is blue, with scattered stars, and it must look realistic.

Each star can be clicked, and when you click on it, a story from the dog's life appears in the form of a bubble. On the left side there is a timeline, and on the right side there are photos and some text recorded by the owner. Please draw a conceptual design picture.

No no no, when it opens, it should be a sphere like Earth, except the sphere is in blue tones with scattered stars on it.

When the user clicks on a specific star, that star reveals a story from the dog’s life, displayed in the form of a bubble. On the left side, there should be a timeline, and on the right side, there should be photos and some text recorded by the owner.

We like this color but also would like to keep the general layout of the initial design (layout + this planet).

This planet should make people feel warm and does not cause trauma.

We generated a conceptual design as the input for the AI to work out a basic working structure. The demo is compilable and runnable with npm run tauri dev.

The demo worked without presenting any error message. So continue generating code to implement moon and star scenes. The scene looked pretty good!

We continue generate code to implement the basic features in the conceptual design: UI interface, timeline, memory card, music player, top bar, add memory modal. Now we can see them from the home page. Some features are interactive (add a memory) some are not.

We are building a web-based application called Pet Memory Space, designed to help users record and cherish moments with their pets in a warm and meaningful way. The experience combines memory visualization, emotional storytelling, and AI companionship. 

1. Onboarding: When users first enter the website, they should immediately feel a warm and comforting atmosphere. 
· warm background color · soft animation · welcome message

2. Pet Profile Setup: The system will guide users to create a pet profile. (Name, Gender, Birthday, Breed, Weight, Favorite Things, Upload a photo of the dog)

3. Memory Space: The core feature of the website. The user can create a memory space for their pet. A planet represents the pet’s life journey. Across the planet is a chain of stars, which forms a timeline of memories. Each star represents a memory. When users click on a star, they can see the memory in detail.
Interaction: when users click on a star, it will pop up a bubble with the memory details. Bubble contains: Date, Photo, Memory description written by the owner. 

4. AI Companion: Users can interact with an AI companion designed to simulate the presence of their pet. 

5. Pet Profile Page: Name, Gender, Birthday, Breed, Weight, Favorite Things, Photo, Total Memories.

We need a navigation bar at the top, and it should only appear when the cursor is near the top of the screen.