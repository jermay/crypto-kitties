import React from 'react';
import './css/factory.css';
import './css/mystyle.css';

export default function CatSettings(props) {
  // console.log('catsettings props: ', props);
  /*
          <div className="form-group">
          <label htmlFor="formControlRange"><b>Head and body</b><span className="badge badge-dark ml-2" id="headcode"></span></label>
          <input type="range" min="10" max="98" className="form-control-range" id="bodyColor" />
        </div>
        <div className="form-group">
          <label htmlFor="formControlRange"><b>Accent color</b><span className="badge badge-dark ml-2" id="accentcode"></span></label>
          <input type="range" min="10" max="98" className="form-control-range" id="accentColor" />
        </div>
        <div className="form-group">
          <label htmlFor="formControlRange"><b>Eye color</b><span className="badge badge-dark ml-2" id="eyecode"></span></label>
          <input type="range" min="10" max="98" className="form-control-range" id="eyeColor" />
        </div>
        <div className="form-group">
          <label htmlFor="formControlRange"><b>Ear color</b><span className="badge badge-dark ml-2" id="earcode"></span></label>
          <input type="range" min="10" max="98" className="form-control-range" id="earColor" />
        </div>

        <div className="form-group">
          <label htmlFor="formControlRange"><b>Eye shape</b><span className="badge badge-dark ml-2" id="eyeName"></span></label>
          <input type="range" min="1" max="7" step={1} className="form-control-range" id="eyeShape" />
        </div>
  */

  return (
    <div className="col-lg-7 cattributes m-2 light-b-shadow">
      <div id="catColors">
        {
          props.dna.cattributes.map(cattribute => (
            <div className="form-group" key={'dna-setting-' + cattribute.name}>
              <label htmlFor="formControlRange">
                <b>{cattribute.displayName}</b>
                <span className="badge badge-dark ml-2" id="headcode">
                  {cattribute.value}
                </span>
              </label>
              <input type="range" className="form-control-range"
                id={cattribute.name}
                min={cattribute.minValue}
                max={cattribute.maxValue}
                onChange={props.handleDnaChange}
                defaultValue={cattribute.value}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}
