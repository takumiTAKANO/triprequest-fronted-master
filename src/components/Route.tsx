import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MoveScheduleData } from '../types';
import PointComp from '../components/Point';
import LineComp from '../components/Line';

type Props = {
  data: any;
  courseNum: number;
  onChange: (data: any) => void;
  onSubmit: (data: MoveScheduleData) => void;
};

export default function Route(props: Props) {
  const { data, courseNum, onChange, onSubmit } = props;
  const { Course } = data.ResultSet;
  const { Price, Route } = Course[courseNum];
  const {
    timeOther,
    timeOnBoard,
    timeWalk,
    transferCount,
    distance,
    Line,
    Point,
  } = Route;
  const priceArray: Array<any> = Price.length == null ? [Price] : Price;
  const prices = priceArray.map(price => ({
    ...price,
    Oneway:
      typeof price.Oneway === 'object'
        ? Number(price.Oneway.text)
        : Number(price.Oneway),
  }));
  const lines: Array<any> = Line.length == null ? [Line] : Line;
  const points: Array<any> = Point.length == null ? [Point] : Point;

  const time = Number(timeOther) + Number(timeOnBoard) + Number(timeWalk);
  const kmDistance = Number(distance) / 10;
  const sumPrice = prices.reduce((v, price) => {
    if (/Teiki/.test(price.kind)) return v;
    if (price.selected !== 'true') return v;
    return price.Oneway + v;
  }, 0);
  
  console.log("あ",{
    ...data,
    ResultSet: {
      ...data.ResultSet,
      Course: { ...data.ResultSet.Course/*[courseNum]*/, Price },
    },
  })

  const onPriceChange = (Price: any) =>
    onChange({
      ...data,
      ResultSet: {
        ...data.ResultSet,
        Course: { ...data.ResultSet.Course/*[courseNum]*/, Price },
      },
    });
  const RouteComponents = [];
  for (let i = 0; i < points.length; i++) {
    RouteComponents.push(
      <PointComp key={i + points[i].Station.Name} point={points[i]} />
    );
    if (lines[i] != null) {
      RouteComponents.push(
        <LineComp
          key={i + lines[i].Name}
          lineIndex={i + 1}
          line={lines[i]}
          prices={prices}
          onPriceChange={onPriceChange}
        />
      );
    }
  }

  return (
    <Paper style={{ width: '100%', padding: 16 }}>
      <div>
        <p>所要時間：{time}分</p>
        <p>距離：{kmDistance}km</p>
        <p>乗り換え：{transferCount}回</p>
        <p>運賃：{sumPrice}円</p>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {RouteComponents}
      </div>
      <div style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            onSubmit(
              generateMoveScheduleData({
                kmDistance,
                fare: sumPrice,
                lines,
                points,
              })
            )
          }
        >
          決定
        </Button>
      </div>
    </Paper>
  );
}

const generateMoveScheduleData = (obj: {
  kmDistance: number;
  fare: number;
  lines: any;
  points: any;
}): MoveScheduleData => {
  const { kmDistance, fare, lines, points } = obj;

  let text = '';
  for (let i = 0; i < points.length; i++) {
    text += points[i].Station.Name;
    if (lines[i] != null) {
      const departureTimeStr = new Date(lines[i].DepartureState.Datetime.text)
        .toTimeString()
        .slice(0, 5);
      const arrivalTimeStr = new Date(lines[i].ArrivalState.Datetime.text)
        .toTimeString()
        .slice(0, 5);
      text += `${departureTimeStr}〜${lines[i].Name}〜${arrivalTimeStr}`;
    }
  }
  const startHour = new Date(lines[0].DepartureState.Datetime.text).getHours();
  const endHour = new Date(
    lines[lines.length - 1].ArrivalState.Datetime.text
  ).getHours();

  return {
    type: 'move',
    text,
    fare,
    distance: Math.floor(kmDistance),
    startHour,
    endHour,
  };
};
