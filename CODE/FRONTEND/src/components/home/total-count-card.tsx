import { Card, Skeleton } from "antd";
import { totalCountVariants, TotalCountType } from "./card-style";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";

type Props = {
  resource: TotalCountType;
  isLoading: boolean;
  totalCount: number;
};

const DashbordTotalCountCard = ({ resource, isLoading, totalCount }: Props) => {



  const { primaryColor, secondaryColor, icon, title } = totalCountVariants[resource];

  const config: AreaConfig = {
    data: totalCountVariants[resource].data,
    xField: 'index',
    yField: 'value',
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncViewPadding: true,
    autoFit: true,
    tooltip: false,
    animation: false,
    xAxis: false,
    yAxis: {
      tickCount: 12,
      label: {
        style: {
          stroke: 'transparent'
        }
      },
      grid: {
        line: {
          style: {
            stroke: 'transparent'
          }
        }
      }
    },
    smooth: true,
    line: {
      color: primaryColor
    },
    areaStyle: () => {
      return {
        fill: `l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}`
      }
    }
  }

  return (
    <Card
      style={{ height: "96px", padding: 0 }}
      bodyStyle={{ padding: '8px 8px 8px 12px' }}
      size="small"
    >
      <div style={{ display: 'flex', alignItems: "center", gap: '8px', whiteSpace: 'nowrap' }}>
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: '80x' }}>
          {title}
        </Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text size="xxxl" strong style={{ flex: 1, whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'start', marginLeft: '48px', fontVariantNumeric: 'tabular-nums' }}>
          {isLoading ? (
            <Skeleton.Button style={{ marginTop: '8px', width: '74px' }} />
          ) : (
            totalCount.toString()
          )}
        </Text>
        <Area {...config} style={{ width: '50%' }} />
      </div>
    </Card>
  );
};

export default DashbordTotalCountCard;
