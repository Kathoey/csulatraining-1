import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-router-dom';
import Login from '../Login.js';
import * as AuthContext from '../contexts/AuthContext.js';
import { configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { getInnerHTML } from './Welcome.test'
import { act } from 'react-dom/test-utils';
import testing from '../testingFirebaseConfig.js'

configure({ adapter: new Adapter() });

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useHistory:jest.fn()
}));

const wrapInAct = async (wrapper) => {
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        wrapper.update();
    });
};

let useAuthObj = {
    currentUser: {
        uid: 'testuid123'
    },
    login: {}
}

describe("Various Login/Signup/Password Screens Render", () => {
    it("should render the login screen", async () => {

        jest.spyOn(Router, 'useParams').mockReturnValue({ role: 'student' })
        jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => useAuthObj)

        const wrapper = mount(<Login />)
        await wrapInAct(wrapper);
        // console.log(wrapper.debug());
        expect(getInnerHTML(wrapper.find('.text-center').first())).toEqual('Log In')
        // expect(getInnerHTML(wrapper.find('.moduleContent'))).toEqual('this is an example text module')
    });
})