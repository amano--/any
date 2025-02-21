import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { TRPCReactProvider } from "../src/trpc/react";

initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <TRPCReactProvider>
        <Story />
      </TRPCReactProvider>
    ),
  ],
};

export default preview;
