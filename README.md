# DIGITAL SPACE

Digital Space is an e-commerce website focused on supplying digital assets, mostly UI kits, and icons for developers to improve and modify their projects. The project is built using the MERN stack, with Next.js, Tailwind CSS, and Shadcn/ui.

## Table of contents

- Requirements
- Installation
- Configuration
- Troubleshooting
- FAQ
- Maintainers

## Requirements

This project requires the following to be installed:

- Node.js
- MongoDB
- npm or yarn

## Installation

Follow these steps to install and run the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/DerrickWawerumuturi/DigitalSpace.git
   ```

2. Navigate to the project directory:

   ```bash
   cd digital-space
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the necessary environment variables (e.g., MongoDB URI, API keys).

5. Run the development server:

   ```bash
   npm run dev
   ```

## Configuration

1. Ensure MongoDB is running.
2. Configure your environment variables in the `.env` file. Example:

   ```.env
   MONGODB_URI=mongodb://localhost:27017/digital-space
   NEXT_PUBLIC_API_KEY=your-api-key
   ```

## Troubleshooting

If you encounter issues, check the following:

- Ensure all required environment variables are set correctly.
- Make sure MongoDB is running and accessible.
- Check for any errors in the terminal output and address them as needed.

## FAQ

**Q: How do I add a new digital asset to the inventory?**

**A:** Follow these steps:

1. Navigate to the admin panel - Sign up as Seller or if you are logged in , click on my Account, seller Dashboard.
2. Click on "Products".
3. Fill in the required details and upload the asset files.
4. Save the changes.

**Q: How do I customize the UI components?**

**A:** You can customize the UI components by modifying the corresponding files in the `components` directory. Tailwind CSS classes can be adjusted to change the styling as needed.

## Maintainers

- Derrick Muturi
- Felix Kamau
