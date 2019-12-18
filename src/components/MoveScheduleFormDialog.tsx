import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { MoveScheduleData } from '../types';
import { TripData } from '../types';

import { searchRoute } from '../lib/ekispert';
import StationSearchDialog from '../components/StationSearchDialog';
import Route from '../components/Route';
import { checkTrain } from '../lib/rule';
import { promised } from 'q';


type Props = {
  date: string; // yyyy-MM-dd
  open: boolean;
  tripData: TripData;
  onClose: () => void;
  onSubmit: (data: MoveScheduleData) => void;
};

type State = {
  loading: boolean;
  isOpenStationSearchDialogForDeparture: boolean;
  isOpenStationSearchDialogForArrival: boolean;
  fromText: string;
  fromCode: string;
  toText: string;
  toCode: string;
  time: string; // HH:mm
  searchType: string; // departure | arrival
  assignTeikiSerializeData: string;
  courseNum: number;

  priceNum: number;
  timeNum: number;
  transferNum: number;

  selectingTab: string; // price | time | transfer
  priceResult: any;
  timeResult: any;
  transferResult: any;
};

export default class MoveScheduleFormDialog extends React.PureComponent<
  Props,
  State
  > {
  state: State = {
    loading: false,
    isOpenStationSearchDialogForDeparture: false,
    isOpenStationSearchDialogForArrival: false,
    fromText: '',
    fromCode: '',
    toText: '',
    toCode: '',
    time: '',
    searchType: 'departure',
    assignTeikiSerializeData: '',
    courseNum: 0,

    priceNum: 0,
    timeNum: 0,
    transferNum: 0,

    selectingTab: 'price',
    priceResult: null,
    timeResult: null,
    transferResult: null,
  };

  search = () => {
    const { tripData, date, } = this.props;
    const {
      jobTitle,
      tripClass,
      costClass,
      startDate,
      endDate,
      destination,
      maxDistance,
    } = tripData;
    const {
      fromCode,
      toCode,
      time,
      searchType,
    } = this.state;
    const searchData = { from: fromCode, to: toCode, date, time, searchType };

    this.setState({ loading: true });

    const getjson = (String)(localStorage.getItem("triprequest"))
    const obj = JSON.parse(getjson);
    const assignTeikiSerializeData = obj["assignTeikiSerializeData"]
    Promise.all([
      searchRoute({ ...searchData, sort: 'price', assignTeikiSerializeData }),
      searchRoute({ ...searchData, sort: 'time', assignTeikiSerializeData }),
      searchRoute({ ...searchData, sort: 'transfer', assignTeikiSerializeData }),
    ]).then(([priceResult, timeResult, transferResult]) => {

      var isWayToNaritaAirport = ((toCode === '22392') || (toCode === '29573') || (toCode === '29574') || (toCode === '304034') || (toCode === '29110')
        || (fromCode === '22392') || (fromCode === '29573') || (fromCode === '29574') || (fromCode === '304034') || (fromCode === '29110'));
      var hasOnlyReservedSeats = false;
      var isShinkansen = true;//新幹線だとグリーン不可能

      (async () => {
        for (var i = 0; i < (priceResult.ResultSet.Course).length; i++) {
          var priceOneWayDistance = parseInt(priceResult.ResultSet.Course[i].Route.distance) / 10.0;
          var priceCheck = true;
          for (let priceLine of priceResult.ResultSet.Course[i].Route.Line) {
            var priceDistanceForTheSameTrainSection = parseInt(priceLine.distance) / 10.0;
            await checkTrain({
              tripClass,
              isWayToNaritaAirport,
              distanceForTheSameTrainSection: priceDistanceForTheSameTrainSection,
              oneWayDistance: priceOneWayDistance,
              hasOnlyReservedSeats,
              isShinkansen
            }).then((trainData) => {
              var { trainAvailableSeats } = trainData;
              if ((JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急", "急行"]))
                || (JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急"]))) {
                if (priceLine.Type.detail === "shinkansen") {
                  priceCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify(["普通車指定"])) {
                if ((priceLine.Type.detail === "liner") || (priceLine.Typedetail === "limitedExpress")) {
                  priceCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify([])) {
                if ((priceLine.Type.detail === "shinkansen") || (priceLine.Type.detail === "liner") || (priceLine.Type.detail === "limitedExpress")) {
                  priceCheck = false;
                }
              }
            })
          }
          if (priceCheck === true) {
            console.log("最安", i, "コース")
            this.setState({ priceNum: i });
            break;
          }
        }
      })();

      (async () => {
        for (var i = 0; i < (timeResult.ResultSet.Course).length; i++) {
          var timeOneWayDistance = parseInt(timeResult.ResultSet.Course[i].Route.distance) / 10.0;
          var timeCheck = true;
          for (let timeLine of timeResult.ResultSet.Course[i].Route.Line) {

            var timeDistanceForTheSameTrainSection = parseInt(timeLine.distance) / 10.0;

            await checkTrain({
              tripClass,
              isWayToNaritaAirport,
              distanceForTheSameTrainSection: timeDistanceForTheSameTrainSection,
              oneWayDistance: timeOneWayDistance,
              hasOnlyReservedSeats,
              isShinkansen
            }).then((trainData) => {
              var { trainAvailableSeats } = trainData;
              if ((JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急", "急行"]))
                || (JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急"]))) {
                if (timeLine.Type.detail === "shinkansen") {
                  timeCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify(["普通車指定"])) {
                if ((timeLine.Type.detail === "liner") || (timeLine.Typedetail === "limitedExpress")) {
                  timeCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify([])) {
                if ((timeLine.Type.detail === "shinkansen") || (timeLine.Type.detail === "liner") || (timeLine.Type.detail === "limitedExpress")) {
                  timeCheck = false;
                }
              }
            })
          }
          if (timeCheck === true) {
            console.log("最短", i, "コース")
            this.setState({ timeNum: i });
            break;
          }

        }
      })();

      (async () => {
        for (var i = 0; i < (transferResult.ResultSet.Course).length; i++) {
          var transferOneWayDistance = parseInt(transferResult.ResultSet.Course[i].Route.distance) / 10.0
          var transferCheck = true;
          for (let transferLine of transferResult.ResultSet.Course[i].Route.Line) {

            var transferDistanceForTheSameTrainSection = parseInt(transferLine.distance) / 10.0;

            await checkTrain({
              tripClass,
              isWayToNaritaAirport,
              distanceForTheSameTrainSection: transferDistanceForTheSameTrainSection,
              oneWayDistance: transferOneWayDistance,
              hasOnlyReservedSeats,
              isShinkansen
            }).then((trainData) => {
              var { trainAvailableSeats } = trainData;
              if ((JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急", "急行"]))
                || (JSON.stringify(trainAvailableSeats) === JSON.stringify(["特急"]))) {
                if (transferLine.Type.detail === "shinkansen") {
                  transferCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify(["普通車指定"])) {
                if ((transferLine.Type.detail === "liner") || (transferLine.Typedetail === "limitedExpress")) {
                  transferCheck = false;
                }
              }
              else if (JSON.stringify(trainAvailableSeats) === JSON.stringify([])) {
                if ((transferLine.Type.detail === "shinkansen") || (transferLine.Type.detail === "liner") || (transferLine.Type.detail === "limitedExpress")) {
                  transferCheck = false;
                }
              }
            })
          } if (transferCheck === true) {
            console.log("最少乗換", i, "コース")
            this.setState({ transferNum: i });
            break;
          }
        }
      })();
      this.setState({
        loading: false,
        priceResult,
        timeResult,
        transferResult,
      });
    });
  };


  //};

  render() {
    const { date, open, onClose, onSubmit } = this.props;
    const {
      loading,
      isOpenStationSearchDialogForDeparture,
      isOpenStationSearchDialogForArrival,
      fromText,
      fromCode,
      toText,
      toCode,
      time,
      searchType,
      priceNum,
      timeNum,
      transferNum,

      selectingTab,
      priceResult,
      timeResult,
      transferResult,
    } = this.state;

    const isValid =
      fromCode !== '' && toCode !== '' && time !== '' && searchType !== '';

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {date}の移動日程追加
            </Typography>
            <Button color="inherit" onClick={onClose}>
              キャンセル
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ margin: 16 }}>
          <div style={{ display: 'flex' }}>
            <div>
              <div>
                <label style={{ marginRight: 8 }}>出発地：{fromText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      isOpenStationSearchDialogForDeparture: true,
                    })
                  }
                >
                  設定する
                </Button>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ marginRight: 8 }}>目的地：{toText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({ isOpenStationSearchDialogForArrival: true })
                  }
                >
                  設定する
                </Button>
              </div>

            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.setState(state => ({
                    fromText: state.toText,
                    fromCode: state.toCode,
                    toText: state.fromText,
                    toCode: state.fromCode,
                  }));
                }}
              >
                ↑↓
              </Button>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <TextField
              type="time"
              label="時間"
              InputLabelProps={{ shrink: true }}
              value={time}
              onChange={e => this.setState({ time: e.target.value })}
            />
            <TextField
              select
              SelectProps={{ native: true }}
              label="時間指定"
              value={searchType}
              onChange={e => this.setState({ searchType: e.target.value })}
            >
              <option value="departure">出発</option>
              <option value="arrival">到着</option>
            </TextField>
          </div>
          <div
            style={{
              display: 'inline-block',
              position: 'relative',
              marginTop: 16,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!isValid || loading}
              onClick={this.search}
            >
              検索する
            </Button>

            {loading && (
              <CircularProgress
                size={24}
                color="secondary"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }}
              />
            )}
          </div>
        </div>
        <Paper>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={selectingTab}
            onChange={(_, v) => this.setState({ selectingTab: v })}
          >
            <Tab label="最安料金" value="price" />
            <Tab label="最短時間" value="time" />
            <Tab label="最小乗換" value="transfer" />
          </Tabs>
        </Paper>
        {selectingTab === 'price' && priceResult != null && (
          <Route
            data={priceResult}
            courseNum={priceNum}
            onChange={data => this.setState({ priceResult: data })}

            onSubmit={onSubmit}
          />
        )}
        {selectingTab === 'time' && timeResult != null && (
          <Route
            data={timeResult}
            courseNum={timeNum}
            onChange={data => this.setState({ timeResult: data })}
            onSubmit={onSubmit}
          />
        )}
        {selectingTab === 'transfer' && transferResult != null && (
          <Route
            data={transferResult}
            courseNum={transferNum}
            onChange={data => this.setState({ transferResult: data })}
            onSubmit={onSubmit}
          />
        )}
        <StationSearchDialog
          open={isOpenStationSearchDialogForDeparture}
          onClose={() =>
            this.setState({ isOpenStationSearchDialogForDeparture: false })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForDeparture: false,
              fromCode: data.code,
              fromText: data.name,
            })
          }
        />
        <StationSearchDialog
          open={isOpenStationSearchDialogForArrival}
          onClose={() =>
            this.setState({ isOpenStationSearchDialogForArrival: false })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForArrival: false,
              toCode: data.code,
              toText: data.name,
            })
          }
        />
      </Dialog>

    );
  }
}

const Transition = (props: any) => <Slide direction="up" {...props} />;
