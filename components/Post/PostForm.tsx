import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "utils/const";
import { Textarea, TextInput, Button } from "@mantine/core";
import { createStyles, Paper, Group, Text } from "@mantine/core";


type Post = {
  title: string;
  body: string;
  author: "authorLiteral" | string;
};

const useStyles = createStyles((theme) => ({
  post: {
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

const PostForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Post>();

  const onSubmit: SubmitHandler<Post> = (InputData) => {
    const PostData = {
      ...InputData,
      author: "authorLiteral",
    };
    createPost(PostData);
  };

  const createPost = async (postInputData: Post) => {
    
    try {
      const response = await axios.post(`${API_URL}/posts`, { post: postInputData });
      console.log(response);
      
      if (response.status === 201) {
        router.push("/");
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
      <Paper p="xs" radius="xs" className={classes.post}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <TextInput
              className=""
              classNames={{
                input: "pl-2.5 text-gray-600",
                label: "text-gray-500 font-bold mb-1",
              }}
              placeholder="次の日の大事な持ち物を忘れてしまう"
              label="タイトル"
              radius="xs"
              size="md"
              withAsterisk
              {...register("title", { required: true })}
            />
            {errors.title && (
              <span className="text-xs font-bold text-red-400">
                質問のタイトルを入力してください
              </span>
            )}
          </div>
          <div className="mb-10">
            <Textarea
              classNames={{
                input: "pl-2.5 px-2 text-gray-600",
                label: "text-gray-500 font-bold mb-1",
              }}
              placeholder="どんなシチュエーションで何に困っているのか、詳しく記載することで回答してもらいやすくなります"
              label="質問の内容"
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
                質問の内容を入力してください
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
              投稿する
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default PostForm;