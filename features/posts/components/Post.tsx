import {
  Text,
  Avatar,
  Group,
  Menu,
  UnstyledButton,
  Modal,
  Button,
} from "@mantine/core";

// react-icons
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { showNotification } from "@mantine/notifications";
import { MdCheckCircle } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "state/currentUser";
import PostForm from "./PostForm";
import { useDestroyPost } from "../hooks/useDestroyPost";
import { TargetPost } from "../types";
import { User } from "features/users/types";

type Props = {
  id: string;
  userId: string;
  title: string;
  body: string;
  name: string;
  iconSrc: string;
  postedAt: string;
  comments_count: number;
};

export const Post = ({
  id,
  userId,
  title,
  body,
  name,
  iconSrc,
  comments_count,
}: Props) => {
  const currentUser = useAtomValue<User>(currentUserAtom);
  const [opened, setOpened] = useState<boolean>(false);
  const [editOpened, setEditOpened] = useState<boolean>(false);
  const [targetPost, setTargetPost] = useState<TargetPost>({
    id: "",
    title: "",
    body: "",
  });
  const { destroyPost } = useDestroyPost();
  const router = useRouter();

  const handleDelete = async () => {
    const isSuccess = await destroyPost(id);

    if (isSuccess) {
      setOpened(false);
      showNotification({
        autoClose: 3000,
        title: "削除完了",
        message: "投稿を削除しました",
        color: "green.4",
        icon: <MdCheckCircle size={30} />,
      });
    }

    router.back();
  };

  return (
    <div className="pt-5 pb-1 xs:p-5 xs:pt-7">
      <div className="flex justify-between items-center pl-2 text-gray-700 font-bold">
        <div className="xs:tracking-wide xs:text-[1.125rem]">{title}</div>

        {currentUser.id == userId && router.asPath.includes("posts") && (
          // ログインユーザーのidと参照している投稿のuser_idが一致し、詳細ページの場合にメニューを表示
          <Menu position="bottom-end" offset={5} width={180} shadow="md">
            <Menu.Target>
              <UnstyledButton className="flex justify-center items-center bg-gray-100 rounded-full p-2 mr-2">
                <HiOutlineDotsHorizontal className="text-gray-500" size={18} />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  setEditOpened(true),
                    setTargetPost({
                      id: id,
                      title: title,
                      body: body,
                    });
                }}
              >
                編集する
              </Menu.Item>

              <Menu.Item
                onClick={() => setOpened(true)}
                className=" text-red-500"
              >
                削除する
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
      <Modal
        withCloseButton={false}
        fullScreen
        opened={editOpened}
        onClose={() => setEditOpened(false)}
      >
        <PostForm close={setEditOpened} postData={targetPost} />
      </Modal>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withCloseButton={false}
        radius="md"
        size="xs"
      >
        <div className="flex justify-center font-bold text-lg text-gray-800 mt-0.5 mb-3">
          削除しますか？
        </div>
        <div className="mx-1.5">
          <div className="text-sm text-gray-600 mb-8">
            削除した投稿は元に戻すことができません。よろしいですか？
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setOpened(false)}
              variant="light"
              color="green"
            >
              キャンセル
            </Button>
            <Button
              onClick={() => handleDelete()}
              variant="outline"
              color="red"
            >
              削除する
            </Button>
          </div>
        </div>
      </Modal>

      <div className="px-2 pt-3 pb-2.5">
        <div className="w-full break-all xs:text-[1.125rem] leading-7 xs:leading-8 text-gray-600 xs:tracking-wide">
          {body}
        </div>
      </div>
      <Group position="apart" className="mt-1 mb-0.5">
        <Group className="ml-2" spacing="xs">
          <Avatar src={iconSrc} radius={50} size={26} />
          <Text className="ml-[-3.5px] text-gray-600" size="sm">
            {name}
          </Text>
        </Group>
        <Group className="pr-3">
          {comments_count && (
            // コメントがあればアイコンと件数を表示
            <div className=" text-gray-500 flex items-center">
              <HiOutlineChatBubbleOvalLeft className="mr-0.5" />
              <div className="mt-0.5">{comments_count}</div>
            </div>
          )}
        </Group>
      </Group>
    </div>
  );
};
