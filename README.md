# PulsePoint

PulsePoint is an organization management platform tailored for the Star Citizen community. It aims to empower organizations to efficiently manage their outposts, track resources, assign jobs, and foster collaboration among members. This project is under active development and will evolve to include many exciting features in the future.

## Features (Planned)

- **Outpost Tracking**: Maintain a detailed overview of all organizational outposts across the Star Citizen universe.
- **Resource Management**: Monitor resources at each outpost, identify shortages, and optimize logistics.
- **Job Requests**: Set up resource or task requests that notify specific members or groups within the organization.
- **Discord Bot Integration**: Seamlessly interact with PulsePoint through Discord, enabling real-time notifications and commands.
- **Data Visualization**: Utilize rich graphs and charts to gain insights into your organization’s operations.

## Current Status

PulsePoint is in its early stages of development. The website interface and PocketBase database are being built, and no features are functional at the moment. However, significant progress is being made to bring the vision of this tool to life.

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) for a modern, reactive, and fast user interface.
- **Backend**: [PocketBase](https://pocketbase.io/) for managing data and authentication.
- **Hosting**: Self-hosted on a VPS, managed with [Coolify](https://coolify.io/).

## How to Use (Development Environment)

### Important currently no Contributions are accepted!
How to develop and contribute to the project is currently a WIP. This is just a boiler plate text.
There will be contributions accepted in the future.

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/Detroyer2222/PulsePoint.git
   cd PulsePoint
   ```

2. Install dependencies for the SvelteKit frontend:

   ```bash
   npm install
   ```

3. Set up the PocketBase database:

   - Download and set up PocketBase from [here](https://pocketbase.io/docs/).
   - Start the PocketBase server and configure it as needed.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the app in your browser at `http://localhost:5173` (or the specified port).

## Contribution Guidelines

PulsePoint is an open-source project, and contributions are welcome. Here’s how you can help:

1. **Report Issues**: If you encounter bugs or have feature suggestions, please open an issue on GitHub.
2. **Contribute Code**: Fork the repository, make your changes, and submit a pull request.
3. **Spread the Word**: Share the project with Star Citizen organizations that might benefit from it.

## Roadmap

- Implement basic user authentication and role management.
- Develop the outpost tracking and resource management modules.
- Introduce real-time notifications and job request systems.
- Add support for more advanced organization metrics and analytics.

## Acknowledgments

Special thanks to the Star Citizen community for inspiring the creation of this tool. Your feedback and support will help shape PulsePoint into a valuable resource for all organizations.

## License

This project is licensed under the [GNU Affero General Public License](LICENSE).

---

Let’s build the ultimate Star Citizen organization management tool together. Fly safe!

