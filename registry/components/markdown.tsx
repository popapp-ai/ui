import { useTheme } from "@popapp/theme/use-theme";
import { Text, View } from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';
import RNMarkdown, { type RenderRules } from "react-native-markdown-display";
import { ActionIcon } from "@popapp/components/action-icon";

export function Markdown({ children }: { children: string }) {
  const { colors } = useTheme();
  return (
    <RNMarkdown
      style={{
        body: { color: colors.foreground, fontSize: 18, lineHeight: 24 },
        list_item: { lineHeight: 28, marginTop: 10, marginLeft: -10 },
        heading1: { lineHeight: 36, marginTop: 16, fontSize: 32 },
        heading2: { lineHeight: 32, marginTop: 16, fontSize: 28 },
        heading3: { lineHeight: 28, marginTop: 16, fontSize: 24 },
        heading4: { lineHeight: 24, marginTop: 16, fontSize: 22 },
        heading5: { lineHeight: 20, marginTop: 16, fontSize: 20 },
        heading6: { lineHeight: 18, marginTop: 16, fontSize: 18 },
        hr: { marginVertical: 16, backgroundColor: colors.border },
        fence: {
          position: "relative",
          borderRadius: 18,
          marginVertical: 12,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      }}
      rules={rules}
    >
      {children}
    </RNMarkdown>
  );
}

const rules: RenderRules = {
  fence: (node, _children, _parent, styles, inheritedStyles = {}) => {
    let { content } = node;

    if (
      typeof node.content === "string" &&
      node.content.charAt(node.content.length - 1) === "\n"
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <View key={node.key} style={[styles.fence]}>
        <Text
          key={node.key}
          style={[
            inheritedStyles,
            { fontFamily: "ui-monospace", fontSize: 14, lineHeight: 20 },
          ]}
        >
          {content}
        </Text>
        <ActionIcon
          glass={false}
          size="xs"
          style={{ position: "absolute", right: 4, top: 4 }}
          name="document.on.document"
          onPress={() => {
            Clipboard.setString(content);
          }}
        />
      </View>
    );
  },
};
