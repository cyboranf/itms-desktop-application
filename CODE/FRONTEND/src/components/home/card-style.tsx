import { AuditOutlined, ShopOutlined, TeamOutlined } from "@ant-design/icons";

const IconWrapper = ({
  color,
  children,
}: React.PropsWithChildren<{ color: string }>) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    >
      {children}
    </div>
  );
};



export type TotalCountType = "task" | "product" | "user";

export const totalCountVariants: {
  [key in TotalCountType]: {
    primaryColor: string;
    secondaryColor?: string;
    icon: React.ReactNode;
    title: string;
    data: { index: string; value: number }[];
  };
} = {
  product: {
    primaryColor: "#1677FF",
    secondaryColor: "#BAE0FF",
    icon: (
      <IconWrapper color="#E6F4FF">
        <ShopOutlined
          className="md"
          style={{
            color: "#1677FF",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of product",
    data: [
      {
        index: "1",
        value: 3500,
      },
      {
        index: "2",
        value: 2750,
      },
      {
        index: "3",
        value: 5000,
      },
      {
        index: "4",
        value: 4250,
      },
      {
        index: "5",
        value: 5000,
      },
    ],
  },
  user: {
    primaryColor: "#52C41A",
    secondaryColor: "#D9F7BE",
    icon: (
      <IconWrapper color="#F6FFED">
        <TeamOutlined
          className="md"
          style={{
            color: "#52C41A",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of users",
    data: [
      {
        index: "1",
        value: 10000,
      },
      {
        index: "2",
        value: 19500,
      },
      {
        index: "3",
        value: 13000,
      },
      {
        index: "4",
        value: 17000,
      },
      {
        index: "5",
        value: 13000,
      },
      {
        index: "6",
        value: 20000,
      },
    ],
  },
  task: {
    primaryColor: "#FA541C",
    secondaryColor: "#FFD8BF",
    icon: (
      <IconWrapper color="#FFF2E8">
        <AuditOutlined
          className="md"
          style={{
            color: "#FA541C",
          }}
        />
      </IconWrapper>
    ),
    title: "Total number of tasks",
    data: [
      {
        index: "1",
        value: 1000,
      },
      {
        index: "2",
        value: 1300,
      },
      {
        index: "3",
        value: 1200,
      },
      {
        index: "4",
        value: 2000,
      },
      {
        index: "5",
        value: 800,
      },
      {
        index: "6",
        value: 1700,
      },
      {
        index: "7",
        value: 1400,
      },
      {
        index: "8",
        value: 1800,
      },
    ],
  },
};

