import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "utils/const";
import { Textarea, TextInput, Button } from "@mantine/core";
import { createStyles, Paper } from "@mantine/core";


type Comment = {
  title: string;
  body: string;
  author: "authorLiteral" | string;
};

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

const CommentForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Comment>();

  const onSubmit: SubmitHandler<Comment> = (InputData) => {
    const CommentData = {
      ...InputData,
      author: "authorLiteral",
    };
    createComment(CommentData);
  };

  const createComment = async (commentInputData: Comment) => {
    
    try {
      const response = await axios.post(`${API_URL}/posts/[id]/comments`, { post: commentInputData });
      console.log(response);
      
      if (response.status === 201) {
        router.push("/posts/[id]");
        return response.data;
      }
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data.message);
      } else {
        message = String(error);
        console.error(message);
      }
    }
  };

  const { classes } = useStyles();
  return (
    <div>
      <Paper p="xs" radius="xs" className={classes.comment}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <TextInput
            data-autoFocus
              className=""
              classNames={{
                input: "pl-2.5 text-gray-600",
                label: "text-gray-500 font-bold mb-1",
              }}
              placeholder="玄関のドアに持ち物リストを吊るしておく"
              label="対策を簡潔に説明すると？"
              radius="xs"
              size="md"
              withAsterisk
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-xs font-bold text-red-400">
                回答のタイトルを入力してください
              </span>
            )}
          </div>
          <div className="mb-10">
            <Textarea
              classNames={{
                input: "pl-2.5 px-2 text-gray-600",
                label: "text-gray-500 font-bold mb-1",
              }}
              placeholder="紐付きのホワイトボードに持ち物リストを記入し、前日のうちに玄関のドアノブに吊るしておくことで、次の日出かける前に必ず持ち物を確認する動線ができ上がります。細かいところは工夫してみてください。うまくいくといいですね✊"
              label="具体的な内容"
              size="md"
              radius="xs"
              autosize
              minRows={6}
              maxRows={6}
              withAsterisk
              {...register("body", { required: true })}
            />
            {errors.body && (
              <span className="text-xs font-bold text-red-400">
                回答の内容を入力してください
              </span>
            )}
          </div>
          <div className="text-center">
            <Button
              type="submit"
              classNames={{ root: "w-48" }}
              color="yellow"
              size="lg"
            >
              回答する
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default CommentForm;
