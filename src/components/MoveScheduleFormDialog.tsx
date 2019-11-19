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
import { searchRoute } from '../lib/ekispert';
import { searchRoute2 } from '../lib/ekispert';
import { getPass } from '../lib/ekispert';
import StationSearchDialog from '../components/StationSearchDialog';
import Route from '../components/Route';
import { checkTrain } from '../lib/rule';
import { promised } from 'q';

type Props = {
  date: string; // yyyy-MM-dd
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MoveScheduleData) => void;
};

type State = {
  loading: boolean;
  passStart: boolean;
  passEnd: boolean;
  isOpenStationSearchDialogForDeparture: boolean;
  isOpenStationSearchDialogForArrival: boolean;
  isOpenStationSearchDialogForPassStart: boolean;
  isOpenStationSearchDialogForPassEnd: boolean;
  fromText: string;
  fromCode: string;
  toText: string;
  toCode: string;
  passFromText: string;
  passFromCode: string;
  passToText: string;
  passToCode: string;
  time: string; // HH:mm
  searchType: string; // departure | arrival
  assignTeikiSerializeData: string;

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
    passStart: false,
    passEnd: false,
    isOpenStationSearchDialogForDeparture: false,
    isOpenStationSearchDialogForArrival: false,
    isOpenStationSearchDialogForPassStart: false,
    isOpenStationSearchDialogForPassEnd: false,
    fromText: '',
    fromCode: '',
    toText: '',
    toCode: '',
    passFromText: '',
    passFromCode: '',
    passToText: '',
    passToCode: '',
    time: '',
    searchType: 'departure',
    assignTeikiSerializeData: '',

    selectingTab: 'price',
    priceResult: null,
    timeResult: null,
    transferResult: null,
  };
  /*}
    pass = () => {
      const { } = this.props;
      const { passFromCode, passToCode, searchType } = this.state;
      const searchData = { passFrom: passFromCode, passTo: passToCode, searchType };
  
      this.setState({ loading: true });
  
      getPass({ ...searchData, sort: 'time' })
        .then((json) => {
          console.log(json.ResultSet.Course.Teiki.SerializeData),
            this.setState({
              loading: false,
              assignTeikiSerializeData: json.ResultSet.Course.Teiki.SerializeData
            });
        });
    };
  */
  search = () => {
    const { date } = this.props;
    const { fromCode, toCode, time, searchType, /*assignTeikiSerializeData,*/ passFromCode, passToCode, passStart,passEnd } = this.state;
    const searchData = { from: fromCode, to: toCode, date, time, searchType, /*teikiData: assignTeikiSerializeData,*/ passFrom: passFromCode, passTo: passToCode };

    this.setState({ loading: true });

    if (passStart && passEnd) {
      getPass({ ...searchData, sort: 'time' })
        .then((json) => {
          Promise.all([
            searchRoute({ ...searchData, sort: 'price', teikiData: json.ResultSet.Course.Teiki.SerializeData }),
            searchRoute({ ...searchData, sort: 'time', teikiData: json.ResultSet.Course.Teiki.SerializeData }),
            searchRoute({ ...searchData, sort: 'transfer', teikiData: json.ResultSet.Course.Teiki.SerializeData }),
          ]).then(([priceResult, timeResult, transferResult]) => {
            this.setState({
              loading: false,
              priceResult,
              timeResult,
              transferResult,
            });
          });
        });
    }else{
      Promise.all([
      searchRoute2({ ...searchData, sort: 'price'}),
      searchRoute2({ ...searchData, sort: 'time'}),
      searchRoute2({ ...searchData, sort: 'transfer'}),
    ]).then(([priceResult, timeResult, transferResult]) => {
      this.setState({
        loading: false,
        priceResult,
        timeResult,
        transferResult,
      });
    });
    };
  };

  render() {
    const { date, open, onClose, onSubmit } = this.props;
    const {
      loading,
      isOpenStationSearchDialogForDeparture,
      isOpenStationSearchDialogForArrival,
      isOpenStationSearchDialogForPassStart,
      isOpenStationSearchDialogForPassEnd,
      fromText,
      fromCode,
      toText,
      toCode,
      passFromText,
      passFromCode,
      passToText,
      passToCode,
      time,
      searchType,
      assignTeikiSerializeData,

      selectingTab,
      priceResult,
      timeResult,
      transferResult,
    } = this.state;

    const isValid =
      fromCode !== '' && toCode !== '' && time !== '' && searchType !== '';
/*
    const isPassValid =
      passFromCode !== '' && passToCode !== '' && searchType !== '';
*/
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
              <div style={{ marginTop: 16 }}>
                <label style={{ marginRight: 8 }}>定期区間：{passFromText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      isOpenStationSearchDialogForPassStart
                        : true
                    })
                  }
                >
                  設定する
                </Button>
                <label style={{ marginRight: 8 }}> 〜{passToText}</label>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      isOpenStationSearchDialogForPassEnd
                        : true
                    })
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
            {/*
            <Button
              variant="contained"
              color="primary"
              disabled={!isPassValid || loading}
              onClick={this.pass}

            >
              検索する
            </Button>
            */}
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
            onChange={data => this.setState({ priceResult: data })}
            onSubmit={onSubmit}
          />
        )}
        {selectingTab === 'time' && timeResult != null && (
          <Route
            data={timeResult}
            onChange={data => this.setState({ timeResult: data })}
            onSubmit={onSubmit}
          />
        )}
        {selectingTab === 'transfer' && transferResult != null && (
          <Route
            data={transferResult}
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
        <StationSearchDialog
          open={isOpenStationSearchDialogForPassStart
          }
          onClose={() =>
            this.setState({
              isOpenStationSearchDialogForPassStart: false
            })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForPassStart: false,
              passFromCode: data.code,
              passFromText: data.name,
              passStart: true,
            })
          }
        />
        <StationSearchDialog
          open={isOpenStationSearchDialogForPassEnd
          }
          onClose={() =>
            this.setState({
              isOpenStationSearchDialogForPassEnd: false
            })
          }
          onSubmit={data =>
            this.setState({
              isOpenStationSearchDialogForPassEnd: false,
              passEnd: true,
              passToCode: data.code,
              passToText: data.name,
            })
          }
        />
      </Dialog>

    );
  }
}

const Transition = (props: any) => <Slide direction="up" {...props} />;
