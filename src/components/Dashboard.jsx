import React, { Component } from 'react';
import { firebaseDatabase } from '../utils/firebaseUtils';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import Box from '@material-ui/core/Box';
import MuiAlert from '@material-ui/lab/Alert';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';

function valuetext(value) {
    firebaseDatabase.ref().update({
        quantity: value
    })
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const marks = [
    {
        value: 0,
        label: '0'
    },
    {
        value: 200,
        label: '200ml'
    }
]

export default class System extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    initialState = () => {
        return {
            data: []
        }
    }

    componentDidMount() {
        const dataRef = firebaseDatabase.ref();
        dataRef.on('value', (snapshot) => {
            let data = snapshot.val();
            let newState = [];
            
            newState.push({
                active: data.active, 
                withCup: data.withCup,
                percentage: data.percentage,
                preparing: data.preparing,
                current_quantity: data.current_quantity,
                status: data.status,
                temperature: data.temperature
            })

            this.setState({
                data: newState,
            })
        })
    }

    turnOn = () => {
        firebaseDatabase.ref().update({
            active: true,
            status: "Cafeteira ligada!"
        })

    }

    turnOff = () => {
        firebaseDatabase.ref().update({
            active: false,
            status: "Cafeteira desligada!"
        })
    }

    startPrepare = () => {
        firebaseDatabase.ref().update({
            preparing: true
        })
    }

    render() {
        let { data, openAlert } = this.state;
        return (
            <div>
                { 
                    data[0] && (data[0].active == true) ? 
                    <div>
                        <Alert severity="success">{data[0] && data[0].status}</Alert>
                        <div>
                            <div style={{marginBottom: 20, marginTop: 10}}>
                                <span>Cafeteira Ligada</span>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.turnOff}
                                    endIcon={<FlashOnIcon />}
                                >
                                Desligar
                                </Button>
                            </div>
                        </div>

                        <div style={{ marginTop: 30 }}>
                                {data[0].withCup == true ? <div><CheckCircleIcon style={{ color: '#02be00' }} fontSize="small" /><span>Copo no lugar.</span></div> :
                                    <div><ErrorIcon color="secondary" fontSize="small" /> <span>Por favor, coloque um copo. </span></div> }
                        </div>

                        <div style={{ marginTop: 50 }}>
                            <Typography id="discrete-slider" gutterBottom style={{ marginBottom: 50 }}>
                                Quantidade
                            </Typography>
                            <Slider
                                style={ {width:400} }
                                defaultValue={50}
                                getAriaValueText={valuetext}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="auto"
                                step={10}
                                marks={marks}
                                min={10}
                                max={200}
                                valueLabelDisplay="on"
                            />
                        </div>
                        <div style={{ marginTop: 50 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.startPrepare}
                                endIcon={<FlashOnIcon />}
                                disabled={data[0] && !data[0].withCup}
                            >
                                Preparar Café
                            </Button>
                        </div>
                        
                        {
                            data[0] && data[0].preparing ? 
                                <div>
                                    <div style={{ marginTop: 50 }}>
                                        <EmojiFoodBeverageIcon fontSize="large" style={{ color: (data[0].temperature < 30 ? 'blue' : 'red') }} />
                                        <Typography variant="caption" component="div" color="textSecondary">{data[0].temperature}º</Typography>
                                    </div>
                                    <div style={{ marginTop: 50 }}>
                                        <Typography variant="caption" component="div" color="textSecondary" style={{ marginBottom: 30 }}>Preparando...</Typography>
                                        <Box position="relative" display="inline-flex">
                                            <CircularProgress variant="determinate" value={data[0].percentage} style={{ width: 60, marginRight: 20 }} />
                                            <Box
                                                top={0}
                                                left={0}
                                                bottom={0}
                                                right={0}
                                                position="absolute"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Typography variant="caption" component="div" color="textSecondary">{data[0].percentage}%</Typography>
                                            </Box>
                                        </Box>
                                    </div> 
                                </div> :
                                <div></div>
                        }
                    </div> : 
                    <div>
                        <Alert severity="success">{data[0] && data[0].status}</Alert>
                        <div style={{ marginTop: 30, marginBottom: 20 }}>
                            <span>Cafeteira Desligada</span>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.turnOn}
                                endIcon={<FlashOnIcon />}
                            >
                                Ligar
                            </Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
};