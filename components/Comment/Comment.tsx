import {
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  Button,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  body: {
    paddingLeft: 7,
    paddingTop: 8,
    paddingBottom: 5,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface CommentProps {
  title: string;
  body: string;
  author: string;
  postedAt: string;
}

export const Comment = ({ title, body, author, postedAt }: CommentProps) => {
  const { classes } = useStyles();
  return (
    <Paper
      shadow="sm"
      radius="xs"
      p="xs"
      withBorder
      className={classes.comment}
    >
      <Group className="my-2" position="apart">
        <Group spacing="xs" className="px-1">
          <Avatar alt={"author.name"} radius="xl" size="lg" />
          <Text className="text-gray-600" size="lg">
            {author}
          </Text>
        </Group>
        <Group className="pr-2">
          <Text size="sm" color="dimmed">
            {postedAt}
          </Text>
        </Group>
      </Group>
      <Text className="pl-2 pb-3 text-gray-600 font-bold" size="xl">
        {title}
      </Text>

      <TypographyStylesProvider className={classes.body}>
        <div className="w-full break-all text-gray-500 text-base">{body}</div>
      </TypographyStylesProvider>
      <Group className="my-5" position="center">
        <Button
          variant="gradient"
          gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
        >
          やりたい！28
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: "teal", to: "cyan", deg: 60 }}
        >
          リストに追加
        </Button>
      </Group>
    </Paper>
  );
};