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
        { iconName: "mobile", title: "Phones" },
        { iconName: "computer", title: "Computers" },
        { iconName: "smartWatch", title: "SmartWatch" },
        { iconName: "camera", title: "Camera"},
        { iconName: "headphone", title: "HeadPhones" },
        { iconName: "gamepad", title: "Gaming" },
        { iconName: "furniture", title: "Furniture" },
        { iconName: "shirt", title: "Clothes" },
        { iconName: "dogHand", title: "Animal" },
        { iconName: "makeup", title: "makeup" }
      ],
    });
    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

export default seedData;