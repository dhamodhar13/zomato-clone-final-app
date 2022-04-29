import React from 'react';
import QuickSearchItem from './QuickSearchItem';
import '../styles/home.css'

class QuickSearch extends React.Component {
    render() {
        const { quickSearchData } = this.props;
        return (
            <div className='bottom-section'>
                <div className="container">
                    <div className="heading">Quick Searches</div>
                    <div className="subHeading">Discover restaurants by type of meal</div>
                    <div className='row'>
                        {quickSearchData.map((item, index) => {
                            return <QuickSearchItem key={index} quickSearchData={item} />
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default QuickSearch;