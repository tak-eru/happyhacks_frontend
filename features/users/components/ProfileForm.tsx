import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Button,
  Divider,
  Modal,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { currentUserAtom } from "state/currentUser";
import { TbCameraPlus } from "react-icons/tb";
import axios from "axios";
import { API_BASE_URL } from "const/const";
import { showNotification } from "@mantine/notifications";
import { MdCheckCircle } from "react-icons/md";

type User = {
  id: string;
  name: string;
  email: string;
  picture: string | undefined;
};

const animals = [
  "rabbit",
  "dog",
  "cat",
  "bear",
  "elephant",
  "chicken",
  "cow",
  "mouse",
  "panda",
  "racoon",
  "penguin",
];

const ProfileForm = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [opened, setOpened] = useState(false);
  const [targetSrc, setTargetSrc] = useState<string | undefined>(
    currentUser.picture
  );

  // アクセストークン取得
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently({});
        setAccessToken(token);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    getToken();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({ defaultValues: { name: currentUser?.name || "" } });

  const onSubmit: SubmitHandler<User> = (InputData) => {
    const patchUserData = {
      ...InputData,
      picture: targetSrc,
    };

    updateUser(patchUserData);
  };

  const updateUser = async (userInputData: {name: string, picture: string | undefined}) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/${currentUser.id}`,
        {
          user: userInputData,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedCurrentUser ={
          id: currentUser.id,
          sub: currentUser.sub,
          email: currentUser.email,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at,
          ...userInputData,
        }
        
        // currentUserAtom を更新する
        setCurrentUser(updatedCurrentUser);

        // // モーダルを閉じる処理
        if (opened) {
          setOpened(false);
        }

        // router.push(`/posts/${props.postId}`);
        showNotification({
          title: "更新完了",
          message: "プロフィールを更新しました",
          color: "green.4",
          icon: <MdCheckCircle size={30} />,
        });
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

  const animalsAvatar = animals.map((animal) => {
    <Avatar src={`/userAvatar/${animal}.svg`} radius={50} size={56} />;
  });

  return (
    <div>
      <h2 className="mt-20 mb-3 text-[1.1rem] text-gray-800">プロフィール</h2>
      <UnstyledButton
        onClick={() => setOpened(true)}
        className="flex relative mb-5"
      >
        <div className="absolute bg-gray-900/[.3] w-[96px] h-[96px] rounded-full z-10"></div>
        <div className="absolute top-9 left-9">
          <div className="flex">
            <TbCameraPlus className="text-white z-20 text-[1.5rem]" />
          </div>
        </div>
        <Avatar src={currentUser.picture} radius={50} size={96} />
      </UnstyledButton>

      <Modal
        radius="xs"
        centered
        overlayOpacity={0.35}
        withCloseButton={false}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <div className="flex-col justify-center">
          <h3 className="flex justify-center text-base font-normal mb-4">
            プロフィール画像の変更
          </h3>
          <Divider className="mx-2 mb-3"></Divider>
          <p className="flex justify-center mx-3 mb-6">
            自分のアイコンを使用するか、一覧からアイコンを選んで変更することができます。
          </p>
          <div className="flex justify-center mb-8">
            <Avatar src={targetSrc} radius={50} size={80} />
          </div>
          <div className="flex-col">
            <div className="flex justify-evenly mb-4">
              <ul className="grid grid-cols-4 gap-4">
                <li className="flex items-center justify-center bg-gray-800/[.3] w-[56px] h-[56px] rounded-full">
                  {/* {画像アップロード対応したい} */}
                  {/* <div className="flex absolute items-center justify-center">
                    <FileButton
                      onChange={setFile}
                      accept="image/png,image/jpeg"
                    >
                      {(props) => (
                        <UnstyledButton {...props}>
                          <TbCameraPlus className="flex text-zinc-100 text-[1.5rem] z-50" />
                        </UnstyledButton>
                      )}
                    </FileButton>
                  </div> */}
                  <UnstyledButton onClick={() => setTargetSrc(user?.picture)}>
                    <Avatar src={user?.picture} radius={50} size={56} />
                  </UnstyledButton>
                </li>
                {animals.map((animal) => {
                  return (
                    <li key={animal}>
                      <UnstyledButton
                        onClick={() =>
                          setTargetSrc(`/userAvatar/${animal}.svg`)
                        }
                      >
                        <Avatar
                          src={`/userAvatar/${animal}.svg`}
                          radius={50}
                          size={56}
                        />
                      </UnstyledButton>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Divider className="mx-2 mb-5"></Divider>
            <div className="flex justify-end mr-2">
              <Button
                onClick={() => setOpened(false)}
                className="mr-2"
                size="xs"
                radius="xs"
                variant="light"
                color="gray"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                size="xs"
                radius="xs"
                color="green.4"
              >
                更新
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <TextInput
            data-autofocus
            className=""
            classNames={{
              input: "pl-2.5 text-gray-600",
              label: "text-gray-800 font-bold mb-1",
            }}
            placeholder="田中たろう"
            label="表示名"
            radius="xs"
            size="sm"
            withAsterisk
            {...register("name", { required: true })}
          />
          {errors.name && (
            <span className="text-[0.7rem] font-bold text-red-500">
              ニックネームを入力してください
            </span>
          )}
        </div>
        <div className="text-center">
          <UnstyledButton
            type="submit"
            className="w-full h-[40px] rounded-[3px] text-[0.9rem] text-center font-bold text-emerald-50 bg-main-green"
          >
            更新する
          </UnstyledButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;