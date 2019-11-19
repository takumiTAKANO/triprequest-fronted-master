import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { DayData } from '../types';
//const XlsxPopulate = require('xlsx-populate');


type Props = {
  dayData: Array<DayData>;
};

export default function Result(props: Props) {
  const { dayData } = props;
  const resultData = generateResultData(dayData);
  const resultDataText = resultData.reduce(
    (text, data) =>
      `${text}${data.month},${data.date},${data.body},${data.fare},,${
      data.accommodation
      },,${data.dailyAllowance},,\n`,
    ''
  );

  
    const blob = new Blob([resultDataText], { type: 'text/plain' });
    const objectURL = window.URL.createObjectURL(blob);
    const download = () => {
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, 'triprequest.txt');
      }
    };
  /*
 const download = () => {
    XlsxPopulate.fromFileAsync("/Users/takumitakano/Documents/triprequest/shucho_ryohi.xlsx")
      .then((workbook)=>{
        workbook.sheet(0).cell("A19").value("1"),
          //  sheet1.cell("E19").value(resultData[2]),
          // sheet1.cell("T19").value(resultData[3]),
          // sheet1.cell("W19").value(resultData[4]),
          // sheet1.cell("Z19").value(resultData[5]),
          workbook.toFileAsync("/Users/takumitakano/Documents/triprequest/shucho_ryohi.xlsx")
      })
    }
    */
  return (
    <div style={{ margin: 16 }}>
      <Typography variant="headline">日程表</Typography>
      <Paper style={{ width: '100%', marginTop: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>月</TableCell>
              <TableCell>日</TableCell>
              <TableCell>日程</TableCell>
              <TableCell>運賃(円)</TableCell>
              <TableCell>宿泊料(円)</TableCell>
              <TableCell>日当(円)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultData.map(data => (
              <TableRow key={data.month + data.date + data.body}>
                <TableCell>{data.month}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.body}</TableCell>
                <TableCell>{data.fare}</TableCell>
                <TableCell>{data.accommodation}</TableCell>
                <TableCell>{data.dailyAllowance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Button
        style={{ marginTop: 16 }}
        variant="contained"
        color="primary"
        onClick={download}
        //  href={objectURL}
        component="a"
        download="triprequest.txt"
      >
        ファイル保存
      </Button>
    </div>
  );
}

type ResultData = {
  month: string;
  date: string;
  body: string;
  fare: string;
  accommodation: string;
  dailyAllowance: string;
};

const generateResultData = (dayData: Array<DayData>): Array<ResultData> => {
  let resultData: Array<ResultData> = [];
  dayData.forEach(data => {
    const month = data.date.slice(5, 7);
    const date = data.date.slice(8, 10);
    if (data.schedules.length === 0) {
      resultData.push({
        month,
        date,
        body: '日程なし',
        fare: '',
        accommodation: String(data.accommodationAmount),
        dailyAllowance: String(data.dailyAllowanceAmount),
      });
      return;
    }
    const firstSchedule = data.schedules[0];
    resultData.push({
      month,
      date,
      body: firstSchedule.text,
      fare: firstSchedule.type === 'move' ? String(firstSchedule.fare) : '',
      accommodation: String(data.accommodationAmount),
      dailyAllowance: String(data.dailyAllowanceAmount),
    });
    for (let i = 1; i < data.schedules.length; i++) {
      let schedule = data.schedules[i];
      resultData.push({
        month: '',
        date: '',
        body: schedule.text,
        fare: schedule.type === 'move' ? String(schedule.fare) : '',
        accommodation: '',
        dailyAllowance: '',
      });
    }
  });
  return resultData;
};
