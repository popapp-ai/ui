import { defineConfig } from 'vocs'



export default defineConfig({
  title: 'PopApp UI',
  description: 'React Native component registry for Expo apps',
  rootDir: '.',
  basePath: '/docs',
  iconUrl: '/assets/icon.svg',
  logoUrl: {
    light: '/assets/ui-logo-light.svg',
    dark: '/assets/ui-logo-dark.svg',
  },
  aiCta:
    process.env.NODE_ENV === 'development'
      ? true
      : {
          query: ({ location }) => {
            const fixLocation = (loc: string, basePath: string) => {
              try {
                const url = new URL(loc)
                const base = basePath.startsWith('/') ? basePath : `/${basePath}`
                const path = url.pathname === '/' ? '' : url.pathname
                url.pathname = base + path
                return url.toString()
              } catch {
                return loc
              }
            }
            return `Please research and analyze this page: ${fixLocation(location, '/docs')} so I can ask you questions about it.`
          },
        },
  topNav: [
    { text: 'PopApp', link: 'https://popapp.dev' },
    { text: 'GitHub', link: 'https://github.com/popapp-ai/ui' },
  ],
  sidebar: [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/' },
        { text: 'Installation', link: '/getting-started' },
        { text: 'Architecture', link: '/architecture' },
        { text: 'Project Structure', link: '/project-structure' },
        { text: 'AI Skill', link: '/skill' },
      ],
    },
    {
      text: 'Foundation',
      items: [
        { text: 'Theme', link: '/theme' },
        { text: 'CLI Reference', link: '/cli' },
      ],
    },
    {
      text: 'Components',
      collapsed: false,
      items: [
        {
          text: 'Layout',
          items: [
            { text: 'Screen', link: '/components/screen' },
            { text: 'Card', link: '/components/card' },
            { text: 'List', link: '/components/list' },
            { text: 'Separator', link: '/components/separator' },
          ],
        },
        {
          text: 'Form & Input',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'TextInput', link: '/components/text-input' },
            { text: 'TextArea', link: '/components/text-area' },
            { text: 'OTPInput', link: '/components/otp-input' },
            { text: 'DatePicker', link: '/components/date-picker' },
            { text: 'SliderBar', link: '/components/slider-bar' },
            { text: 'RulerSlider', link: '/components/ruler-slider' },
            { text: 'InputStepper', link: '/components/input-stepper' },
          ],
        },
        {
          text: 'Selection',
          items: [
            { text: 'OptionCard', link: '/components/option-card' },
            { text: 'OptionGroup', link: '/components/option-group' },
          ],
        },
        {
          text: 'Display & Feedback',
          items: [
            { text: 'Badge', link: '/components/badge' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'ProgressRing', link: '/components/progress-ring' },
            { text: 'Ticker', link: '/components/ticker' },
            { text: 'Markdown', link: '/components/markdown' },
          ],
        },
        {
          text: 'Interaction',
          items: [
            { text: 'Touchable', link: '/components/touchable' },
            { text: 'AnimatedContent', link: '/components/animated-content' },
            { text: 'BottomSheet', link: '/components/bottom-sheet' },
          ],
        },
        {
          text: 'Icons',
          items: [
            { text: 'IconSymbol', link: '/components/icon-symbol' },
            { text: 'SVG Icons', link: '/components/svg-icons' },
            { text: 'ActionIcon', link: '/components/action-icon' },
            { text: 'ThemeIcon', link: '/components/theme-icon' },
          ],
        },
        {
          text: 'Onboarding',
          items: [
            { text: 'Overview', link: '/components/onboarding' },
          ],
        },
      ],
    },
    {
      text: 'Utils & Hooks',
      items: [
        { text: 'Gradient Tint', link: '/utils/gradient-tint' },
        { text: 'Haptics', link: '/utils/haptics' },
        { text: 'Glass', link: '/utils/glass' },
        { text: 'useColorScheme', link: '/hooks/use-color-scheme' },
        { text: 'useTheme', link: '/hooks/use-theme' },
      ],
    },
    {
      text: 'Templates',
      items: [
        { text: 'Supabase Auth', link: '/templates/auth-supabase' },
      ],
    },
    {
      text: 'Patterns',
      items: [
        { text: 'Composition', link: '/patterns/composition' },
        { text: 'Theming', link: '/patterns/theming' },
        { text: 'Animation Tiers', link: '/patterns/animation-tiers' },
      ],
    },
  ],
})
