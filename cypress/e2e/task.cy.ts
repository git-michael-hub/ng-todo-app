// navigatge to all list page
// user should be able to view the list of task

// user should be able to add task
// should successfully create a task with valid data
// should show an error for missing title
// should show an error for missing description
// should not allow a past due date
// should allow creating a task with different priorities

// user should be able to edit task
// should successfully edit a task with valid data
// should show an error for missing title
// should show an error for missing description
// should not allow a past due date
// should allow creating a task with different priorities

// user should be able to view task
// user should be able to delete task


// recently added
// today
// upcoming
// high priority
// completed
// archive

import GET_TASK_LIST from './../fixtures/task-list.json';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;




context('Functionality', () => {
  describe.only('Task Creation', () => {
    beforeEach(() => {
      cy.visit('/');

      cy.get('[data-test="add-task-button"]')
        .click()
        .then(() => {
          cy.get('mat-dialog-container').should('be.visible');
          cy.get('[data-test="dialog-title"]').contains('Add a New Task');
        });
    });

    describe.only('Happy Path', () => {
      it('should successfully create a task with valid data', () => {
        const TITLE = 'Create task number happy path';
        const DESCRIPTION = 'To create a task number happy path.';
        const TO_ADD = {
          "title": TITLE,
          "description": `<p>${DESCRIPTION}</p>`,
          "date": moment(Date.now()),
          "priority": "low"
        };

        cy.window()
          .then((win) => {
            (win as any).NG_APP_ROOT.STORE().task.list.set([]);
            (win as any).NG_APP_ROOT.STORE().task.list.set(GET_TASK_LIST);
          });

        cy.wait(500);

        cy.get('[data-test="task-title-input"]').type(TITLE);
        cy.get('[data-test="task-description-input"]').type(DESCRIPTION);

        cy.intercept('POST', 'http://localhost:3000/api/tasks', {
          statusCode: 201,
          body: TO_ADD
        }).as('postTask');

        cy.get('[data-test="dialog-action-add"]').click();

        cy.window()
          .then((win) => {
            // (win as any).NG_APP_ROOT.STORE().task.list.update((tasks: any) => [...tasks, TO_ADD]);
            (win as any).NG_APP_ROOT.STORE().task.added.set(TO_ADD || null);
            cy.log((win as any).NG_APP_ROOT.STORE().task.added()?.id);
          });
      });
    });

    describe('Edge Case', () => {
      it('should show an error for missing title', () => {

      });
      it('should show an error for missing description', () => {

      });
      it('should not allow a past due date', () => {

      });
      it('should allow creating a task with different priorities', () => {

      });
    });
  });

  describe('Task View', () => {
    it('should be able to view task', () => {

    });
  });

  describe('Task List', () => {
    it('should be able to view the list of task', () => {

    });
  });

  describe('Task Edit', () => {
    it('should successfully edit a task with valid data', () => {

    });
    it('should show an error for missing title', () => {

    });
    it('should show an error for missing description', () => {

    });
    it('should not allow a past due date', () => {

    });
    it('should allow editing a task with different priorities', () => {

    });
  });

  describe('Task Delete', () => {
    it('should be able to delete task from the list', () => {

    });

    it('should be able to delete task from the view', () => {

    });
  });
});

context('Visual', () => {

});

context('Behavior', () => {

});
