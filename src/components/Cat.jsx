import React from 'react';
import './css/cats.css';

export default function Cat() {
    return (
        <div className="col-lg-4 catBox m-2 light-b-shadow">
            
            <div className="cat">
                <div className="cat-head-container">
                    <div className="cat-ears">
                        <div className="cat-ear cat-left-ear cat-color-body">
                            <div className="cat-inner-ear cat-color-ears"></div>
                        </div>
                        <div className="cat-ear cat-right-ear cat-color-body">
                            <div className="cat-inner-ear cat-inner-ear-right cat-color-ears"></div>
                        </div>
                    </div>

                    <div className="cat-head cat-color-body">

                        <div className="cat-eyes">
                            <div className="cat-eye cat-color-eyes">
                                <div className="cat-pupils"></div>
                            </div>
                            <div className="cat-eye cat-color-eyes">
                                <div className="cat-pupils"></div>
                            </div>
                        </div>

                        <div className="cat-muzzle">
                            <div className="cat-nose"></div>
                            <div className="cat-mouth cat-color-accent"></div>
                            <div className="cat-mouth cat-mouth-right cat-color-accent"></div>
                            <div className="cat-mouth cat-mouth-bottom cat-color-accent"></div>
                        </div>
                    </div>
                </div>

                <div className="cat-body-container">
                    <div className="cat-body cat-color-body">
                        <div className="cat-belly cat-color-accent"></div>

                        <div className="cat-leg cat-color-body">
                            <div className="cat-foot cat-color-accent"></div>
                        </div>
                        <div className="cat-leg cat-leg-right cat-color-body">
                            <div className="cat-foot cat-color-accent"></div>
                        </div>
                    </div>

                    <div className="cat-tail cat-color-body"></div>
                </div>
            </div>
            <br />
            <div className="dnaDiv" id="catDNA">
                <b>
                    DNA:
             <span id="dnabody"></span>
                    <span id="dnaaccent"></span>
                    <span id="dnaeyes"></span>
                    <span id="dnaears"></span>

                    <span id="dnashape"></span>
                    <span id="dnadecoration"></span>
                    <span id="dnadecorationMid"></span>
                    <span id="dnadecorationSides"></span>
                    <span id="dnadanimation"></span>
                    <span id="dnaspecial"></span>
                </b>
            </div>
        </div>
    );
}
