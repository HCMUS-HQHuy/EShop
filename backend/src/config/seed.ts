import prisma from "src/models/prismaClient";

const seedData = async () => {
  try {
    const cnt = await prisma.categories.count();
    if (cnt > 0) {
      console.log("Seeding skipped: Categories table is not empty.");
      return;
    }
    await prisma.categories.createMany({
      data: [
        { iconname: "mobile", title: "Phones" },
        { iconname: "computer", title: "Computers" },
        { iconname: "smartWatch", title: "SmartWatch" },
        { iconname: "camera", title: "Camera"},
        { iconname: "headphone", title: "HeadPhones" },
        { iconname: "gamepad", title: "Gaming" },
        { iconname: "furniture", title: "Furniture" },
        { iconname: "shirt", title: "Clothes" },
        { iconname: "dogHand", title: "Animal" },
        { iconname: "makeup", title: "makeup" }
      ],
    });
    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

export default seedData;