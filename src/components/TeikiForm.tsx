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
import { TeikiData } from '../types';
import { getPass } from '../lib/ekispert';
import StationSearchDialog from '../components/StationSearchDialog';
import TeikiRoute from '../components/TeikiRoute';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

type State = {
    loading: boolean;
    isOpenStationSearchDialogForDeparture: boolean;
    isOpenStationSearchDialogForArrival: boolean;
    fromCode: string;
    fromText: string;
    toCode: string;
    toText: string;
    searchType: string;//departure | arrival
    assignTeikiSerializeData: string;

    selectingTab: string;
    teikiResult: any;
    teikiData: string;
}

export default class TeikiForm extends React.PureComponent<
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
        searchType: 'departure',
        assignTeikiSerializeData: '',

        selectingTab: '1',
        teikiResult: null,
        teikiData: ''
    };

    teiki = () => {
        const {
            fromCode,
            toCode,
            searchType
        } = this.state;
        const searchData = { from: fromCode, to: toCode, searchType };

        this.setState({ loading: true });

        getPass({ ...searchData, sort: 'ekispert' })
            .then((teikiResult) => {
                this.setState({
                    loading: false,
                    teikiResult
                });
            });
    };

    render() {
        const { open, onClose, onSubmit } = this.props;
        const {
            loading,
            isOpenStationSearchDialogForDeparture,
            isOpenStationSearchDialogForArrival,
            fromText,
            fromCode,
            toText,
            toCode,
            searchType,
            assignTeikiSerializeData,

            selectingTab,
            teikiResult,
            teikiData,
        } = this.state;

        const isValid = fromCode !== '' && toCode !== '' && searchType !== '';

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
                            定期情報の設定
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
                            onClick={this.teiki}
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
                        <Tab label="ルート1" value="1" />
                        <Tab label="ルート2" value="2" />
                        <Tab label="ルート3" value="3" />
                        <Tab label="ルート4" value="4" />
                        <Tab label="ルート5" value="5" />
                    </Tabs>
                </Paper>
                {selectingTab === '1' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={0}
                        onChange={data => this.setState({ teikiResult: data})}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '2' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={1}
                        onChange={data => this.setState({ teikiResult: data})}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '3' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={2}
                        onChange={data => this.setState({ teikiResult: data})}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '4' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={3}
                        onChange={data => this.setState({ teikiResult: data})}
                        onSubmit={onSubmit}
                    />
                )}
                {selectingTab === '5' && teikiResult != null && (
                    <TeikiRoute
                        data={teikiResult}
                        courseNum={4}
                        onChange={data => this.setState({ teikiResult: data})}
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
    };


};

const Transition = (props: any) => <Slide direction="up" {...props} />;