import React, { useEffect } from 'react';

import { Box, useColorMode } from '@chakra-ui/react';
import { themes } from '@storybook/theming';
import { useTranslation } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { useDarkMode } from 'storybook-dark-mode';

import { Providers } from '../src/Providers';
import i18nGlobal from '../src/config/i18next';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_KEY,
} from '../src/constants/i18n';
import logoReversed from './logo-reversed.svg';
import logo from './logo.svg';

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: DEFAULT_LANGUAGE_KEY,
    toolbar: {
      icon: 'globe',
      items: AVAILABLE_LANGUAGES.map(({ key }) => ({
        value: key,
        title: i18nGlobal.t(`languages.${key}`),
      })),
    },
  },
};

export const parameters = {
  options: {
    storySort: {
      order: ['StyleGuide', 'Components', 'Fields', 'App Layout'],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  darkMode: {
    dark: {
      ...themes.dark,
      brandImage: logoReversed.src,
      brandTitle: 'Start UI',
    },
    light: {
      ...themes.light,
      brandImage: logo.src,
      brandTitle: 'Start UI',
    },
  },
  layout: 'fullscreen',
  backgrounds: { disable: true, grid: { disable: true } },
};

const DocumentationWrapper = ({ children, context }) => {
  const { i18n } = useTranslation();
  const isDarkMode = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  // Update color mode
  useEffect(() => {
    // Add timeout to prevent unsync color mode between docs and classic modes
    const timer = setTimeout(() => {
      if (isDarkMode) {
        setColorMode('dark');
      } else {
        setColorMode('light');
      }
    });
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  // Update language
  useEffect(() => {
    i18n.changeLanguage(context.globals.locale);
  }, [context.globals.locale]);

  return (
    <Box
      id="start-ui-storybook-wrapper"
      p="4"
      pb="8"
      bg={colorMode === 'dark' ? 'gray.900' : 'white'}
      flex="1"
    >
      {children}
    </Box>
  );
};

export const decorators = [
  (story, context) => (
    <Providers>
      <MemoryRouter>
        <DocumentationWrapper context={context}>
          {/* Calling as a function to avoid errors. Learn more at:
           * https://github.com/storybookjs/storybook/issues/15223#issuecomment-1092837912
           */}
          {story(context)}
        </DocumentationWrapper>
      </MemoryRouter>
    </Providers>
  ),
];
