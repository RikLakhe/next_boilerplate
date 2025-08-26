import { Button, Alert, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import MainLayout from "@/client/components/layout/MainLayout";
import TitleBanner from "@/client/components/shared/TitleBanner";
import { UsersService } from "@/server/modules/users/user.service";
import { useRouter } from "next/router";
import { User } from "@prisma/client";

// Server-side props
export async function getServerSideProps() {
  const usersService = new UsersService();

  try {
    const users = await usersService.findAll();
    return {
      props: {
        initialUsers: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (error) {
    return {
      props: {
        initialUsers: [],
        initialUserError:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

const Directory = ({
  initialUsers,
  initialUserError,
}: {
  initialUsers: User[];
  initialUserError: string;
}) => {
  const router = useRouter();

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <MainLayout>
      <TitleBanner
        title="Users"
        buttons={
          !initialUserError && (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => {
                router.push("/admin/organization/directory");
              }}
            >
              Manage Users
            </Button>
          )
        }
      />

      {initialUserError && (
        <Alert message={initialUserError} type="error" closable />
      )}

      <Table<User> columns={columns} dataSource={initialUsers} rowKey="id" />
    </MainLayout>
  );
};

export default Directory;
