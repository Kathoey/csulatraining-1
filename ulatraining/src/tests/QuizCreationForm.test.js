import React from 'react';
import { mount } from 'enzyme';
import QuizCreationForm from '../Quiz/QuizCreationForm.js';
import * as AuthContext from '../contexts/AuthContext.js';
import { configure } from "enzyme";
import Router from 'react-router-dom'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import firebase from 'firebase';
import { getInnerHTML } from './Welcome.test'
import { act } from 'react-dom/test-utils';
import testing from '../testingFirebaseConfig.js'


configure({ adapter: new Adapter() });

jest.mock("react-router-dom", () => ({
 ...jest.requireActual("react-router-dom"),
 useParams: jest.fn(),
}));

const wrapInAct = async (wrapper) => {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      wrapper.update();
    });
 };

describe("ProfDashboard", () => {
    it("should show list of students enrolled in their course, modules in the course, and buttons to edit", async () => {
        let fakeCoursesSnapshot = {
            mfklsdjfhfjdk: {
                name: "COMP 123",
                professor: "dfhsakjfkladjfl",
                modules: {
                    safjdkjfdsljzzz: {
                        name: 'mod1',
                        type: 'text',
                        content: 'this is an example text module'
                    }, 
                    fjudfsahdsadkl: {
                        name: 'mod2',
                        type: 'text',
                        content: 'here is the second text module'
                    }
                }
            }
        }

        let fakeUserCourses = {
            mfklsdjfhfjdk: {
                name: "COMP 123",
                professor: 'dfhsakjfkladjfl',
                modules: {
                    safjdkjfdsljzzz: 100,
                    fjudfsahdsadkl: 0

                }
            }
        }

        let user = {
            currentUser: {
                uid: 'dfhsakjfkladjfl',
                role: "professor"
            }
        }

        let testUsers = {
            teststudent: {
                courses: fakeUserCourses,
                firstName: "Test",
                lastName: "Student",
                onyen: "teststudent",
                role: "student"
            },
            dfhsakjfkladjfl: {
                firstName: "professor",
                lastName: "smart",
                role: "professor"
            }
            
        }

        jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => user)
        jest.spyOn(Router, 'useParams').mockReturnValue({cid: 'mfklsdjfhfjdk'})
        global.alert = jest.fn();

        let profDashboardDatabase = testing.database();
        profDashboardDatabase.ref('users').set(testUsers);
        profDashboardDatabase.ref('courses').set(fakeCoursesSnapshot);

        const wrapper = mount(<QuizCreationForm uid={"dfhsakjfkladjfl"} match={{params: {cid: 'mfklsdjfhfjdk'}}} database={profDashboardDatabase} />)
        await wrapInAct(wrapper);
        expect(getInnerHTML(wrapper.find('.QuizCreatorTitle').first())).toEqual('Quiz Creator')
        wrapper.find('#addButton').last().simulate('click');
        wrapper.find("#createQuestionButton").last().simulate('click');
        wrapper.find("#createQuizButton").last().simulate('click')
    })
});