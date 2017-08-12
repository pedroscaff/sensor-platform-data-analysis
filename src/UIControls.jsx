import './bootstrap/css/bootstrap.css';
import React from 'react';

import Select from 'react-select';
import Slider from 'react-slider';
import 'react-select/dist/react-select.css';
import './ui.css';
// import Legend from './Legend.jsx';

const PROP_TYPES = {
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    gasDefaultValue: React.PropTypes.string,
    layerDefaultValue: React.PropTypes.string,
    gasSelectLabels: React.PropTypes.array,
    layerSelectLabels: React.PropTypes.array,
    onLayerChange: React.PropTypes.func,
    onGasChange: React.PropTypes.func,
    onSliderChange: React.PropTypes.func,
    legendLabels: React.PropTypes.array,
    scale: React.PropTypes.func
};

const DEFAULT_PROPS = {
    title: '',
    defaultLabel: '',
    onSelectChange: function(value) {
        console.log(`value: ${value}`);
    }
};

class UIControls extends React.Component {
    static get getDefaultProps() {
        return DEFAULT_PROPS;
    }
    static get propTypes() {
        return PROP_TYPES;
    }
    constructor(props) {
        super(props);
        this.state = {
            layerValue: 'Simple Comparison',
            gasValue: 'CO2'
            // categories: this.props.legendLabels,
            // scale: this.props.scale
        };
    }
    _onLayerChange(selected) {
        if (selected) {
            this.setState({
                layerValue: selected.value
            });
            this.props.onLayerChange(selected.value);
            // let legendParams = this.props.onSelectChange(selected.value);
            // this.setState({
            //     scale: legendParams.scale,
            //     categories: legendParams.categories
            // });
        } else {
            this.setState({layerValue: ''});
            this.props.onLayerChange('clear');
        }
    }
    _onGasChange(selected) {
        if (selected) {
            this.setState({
                gasValue: selected.value
            });
            this.props.onGasChange(selected.value);
            // let legendParams = this.props.onSelectChange(selected.value);
            // this.setState({
            //     scale: legendParams.scale,
            //     categories: legendParams.categories
            // });
        } else {
            this.setState({gasValue: ''});
            this.props.onGasChange('clear');
        }
    }
    _onSliderChange(key, value) {
        this.props.onSliderChange(value, key);
    }
    componentDidMount() {
        this.setState({
            layerValue: this.props.layerDefaultValue,
            gasValue: this.props.gasDefaultValue
        });
    }
    render() {
        return (
            <div className='ui-controls'>
                <h4 className='ui-controls-title'> {this.props.title} </h4>
                <h6 className='ui-controls-subtitle'> {this.props.subtitle}</h6>
                <Select className='ui-controls-select'
                    options={this.props.layerSelectLabels}
                    onChange={this._onLayerChange.bind(this)}
                    name='Select-dropdown-layer'
                    value={this.state.layerValue}
                    placeholder='Select viz'
                />
                <Select className='ui-controls-select'
                    options={this.props.gasSelectLabels}
                    onChange={this._onGasChange.bind(this)}
                    name='Select-dropdown-gas'
                    value={this.state.gasValue}
                    placeholder='Select gas'
                />
                <h6 className='slider-title'>Altitude Filter</h6>
                <Slider className='ui-controls-slider'
                    defaultValue={[0, 122]}
                    min={0}
                    max={122}
                    withBars={true}
                    orientation='horizontal'
                    onChange={this._onSliderChange.bind(this, 'alt')}
                />
                <h6 className='slider-title-2'>Time Filter</h6>
                <Slider className='ui-controls-slider'
                    defaultValue={[0, 23]}
                    min={0}
                    max={23}
                    withBars={true}
                    orientation='horizontal'
                    onChange={this._onSliderChange.bind(this, 'hour')}
                />
            </div>
        );
    }
}

export default UIControls;
