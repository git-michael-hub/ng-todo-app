import GET_TASK_LIST from './../fixtures/task-list.json';
import TASK from './../fixtures/task.json';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;



context('Functionality', () => {
  describe('Task Creation', () => {
    beforeEach(() => {
      cy.visit('/');

      cy.window()
        .then((win) => {
          cy.log('CYPRESS:', (win as any));
          (win as any).NG_APP.STORE().task.list.set(GET_TASK_LIST);

          cy.get('[data-test="add-task-button"]')
            .click()
            .then(() => {
              cy.get('mat-dialog-container').should('be.visible');
              cy.get('[data-test="dialog-title"]').contains('Add a New Task');

              cy.wait(100);
            });
        });
    });

    describe('Happy Path', () => {
      it('should successfully create a task with valid data', () => {
        // setup
        cy.intercept('POST', '/api/tasks', TASK).as('createTask');

        // action
        cy.get('[data-test="task-title-input"]').type(TASK.title);
        cy.get('[data-test="task-description-input"]').type('task');
        cy.get('[data-test="dialog-action-add"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Added: ${TASK.title.slice(0, 20)}`);
      });
    });

    describe('Edge Case', () => {
      it('should disabled "Add" button for missing title', () => {
        // action
        cy.get('[data-test="task-title-input"]').type(TASK.title);

        // assert
        cy.get('[data-test="dialog-action-add"]').should('be.disabled');
      });

      it('should disabled "Add" button for missing description', () => {
        // action
        cy.get('[data-test="task-description-input"]').type('task');

        // assert
        cy.get('[data-test="dialog-action-add"]').should('be.disabled');
      });

      // it('should not allow a past due date', () => {
      //   // not allow past due for non-admin, allow if admin
      // });

      it('should allow creating a task with low priority', () => {
        // setup
        const PRIORITY = 'low';
        cy.intercept('POST', '/api/tasks', { ...TASK, priority: PRIORITY }).as('createTask');

        // action
        cy.get('[data-test="task-title-input"]').type(TASK.title);
        cy.get('[data-test="task-description-input"]').type('task');
        cy.get(`[data-test="priority-selection-${PRIORITY}"]`).click();
        cy.get('[data-test="dialog-action-add"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Added: ${TASK.title.slice(0, 20)}`);
      });

      it('should allow creating a task with medium priority', () => {
        // setup
        const PRIORITY = 'medium';
        cy.intercept('POST', '/api/tasks', { ...TASK, priority: PRIORITY }).as('createTask');

        // action
        cy.get('[data-test="task-title-input"]').type(TASK.title);
        cy.get('[data-test="task-description-input"]').type('task');
        cy.get(`[data-test="priority-selection-${PRIORITY}"]`).click();
        cy.get('[data-test="dialog-action-add"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Added: ${TASK.title.slice(0, 20)}`);
      });

      it('should allow creating a task with high priority', () => {
        // setup
        const PRIORITY = 'high';
        cy.intercept('POST', '/api/tasks', { ...TASK, priority: PRIORITY }).as('createTask');

        // action
        cy.get('[data-test="task-title-input"]').first().type(TASK.title);
        cy.get('[data-test="task-description-input"]').type('task');
        cy.get(`[data-test="priority-selection-${PRIORITY}"]`).click();
        cy.get('[data-test="dialog-action-add"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Added: ${TASK.title.slice(0, 20)}`);
      });
    });
  });

  describe('Task List', () => {
    beforeEach(() => {
      cy.visit('/');

      cy.window()
        .then((win) => {
          cy.log('CYPRESS:', (win as any));
          (win as any).NG_APP.STORE().task.list.set(GET_TASK_LIST);
          cy.get('[data-test="nav-all_list"]').click();
        });

       cy.wait(100);
    });

    it('should be able to view the list of task', () => {
      const PAGE_TITLE = 'All List';

      // assert
      cy.get('[data-test="page-title-all_list"]').contains(PAGE_TITLE);
      cy.get('[data-test="list-container"]').should('be.visible');
      cy.get('[data-test="list-item"]').should('have.length', 7);
    });
  });

  describe('Task View', () => {
    beforeEach(() => {
      cy.visit('/');

      cy.window()
        .then((win) => {
          cy.log('CYPRESS:', (win as any));
          (win as any).NG_APP.STORE().task.list.set(GET_TASK_LIST);
          cy.get('[data-test="nav-all_list"]').click();

          const PAGE_TITLE = 'All List';

          // setup
          cy.get('[data-test="page-title-all_list"]').contains(PAGE_TITLE);
          cy.get('[data-test="list-container"]').should('be.visible');
          cy.get('[data-test="list-item"]').should('have.length', 7);
        });

      cy.wait(100);
    });

    it('should be able to view task', () => {
      // TODO: challenges on hover
      // cy.get('[data-test="item-wrap"]').first().trigger('mouseover');
      // cy.get('[data-test="item-wrap"]').first().realHover();

      // alternative to hover
      cy.get('[data-test="list-show-buttons"]').first().click({ force: true });

      cy.get('[data-test="item-wrap"]')
        .first()
        .find('[data-test="list-btn-view"]')
        .should('be.visible')
        .click()
        .then(() => {
          // assert
          cy.get('[data-test="dialog-title"]').contains('Task Detail');
        });
    });
  });

  describe('Task Edit', () => {
    beforeEach(() => {
      cy.visit('/');

      cy.window()
        .then((win) => {
          cy.log('CYPRESS:', (win as any));
          (win as any).NG_APP.STORE().task.list.set([
            ...GET_TASK_LIST,
            TASK
          ]);
          cy.get('[data-test="nav-recently_added"]').click();

          const PAGE_TITLE = 'Recently Added';

          cy.get('[data-test="page-title-recently_added"]').contains(PAGE_TITLE);
          cy.get('[data-test="list-container"]').should('be.visible');
          cy.get('[data-test="list-item"]').should('have.length', 8);

          // alternative to hover
          cy.get('[data-test="list-show-buttons"]').first().click({ force: true });

          cy.get('[data-test="item-wrap"]')
            .first()
            .find('[data-test="list-btn-view"]')
            .should('be.visible')
            .click()
            .then(() => {
              cy.get('[data-test="dialog-title"]').contains('Task Detail');
            });
        });

        cy.wait(100);
    });

    describe('Happy Path', () => {
      it('should successfully edit a task with valid data', () => {
        // setup
        const TITLE = ' - Updated';
        const DESCRIPTION = ' - Updated';
        cy.intercept('PUT', '/api/tasks/**', {
          ...TASK,
          title: TASK.title + TITLE,
          description: TASK.description + DESCRIPTION
        }).as('updateTask');

        // action
        cy.get('[data-test="task-title-input"]').click();
        cy.get('[data-test="task-title-input"]').type(TITLE);
        cy.get('[data-test="task-description-input"]').type(DESCRIPTION);
        cy.get('[data-test="dialog-action-update"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Updated:`);
      });
    });

    describe('Edge Case', () => {
      it('should disabled "Update" button for missing title', () => {
        // action
        cy.get('[data-test="task-title-input"]').click();
        cy.get('[data-test="task-title-input"]').clear();

        // assert
        cy.get('[data-test="dialog-action-update"]').should('be.disabled');
      });

      it('should disabled "Update" button for missing description', () => {
        // action
        cy.get('[data-test="task-description-input"]').click();
        cy.get('[data-test="task-description-input"]').type('{selectAll}{backspace}');

        // assert
        cy.get('[data-test="dialog-action-update"]').should('be.disabled');
      });

      it('should allow updating a task with low priority', () => {
        // setup
        const CHANGE = 'medium';
        const PRIORITY = 'low';
        cy.intercept('PUT', '/api/tasks/**', {
          ...TASK,
          priority: PRIORITY
        }).as('updateTask');

        // action
        cy.get(`[data-test="priority-selection-${CHANGE}"]`).click();
        cy.get(`[data-test="priority-selection-${PRIORITY}"]`).click();
        cy.get('[data-test="dialog-action-update"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Updated:`);
      });

      it('should allow updating a task with medium priority', () => {
        // setup
        const CHANGE = 'high';
        const PRIORITY = 'medium';
        cy.intercept('PUT', '/api/tasks/**', {
          ...TASK,
          priority: PRIORITY
        }).as('updateTask');

        // action
        cy.get(`[data-test="priority-selection-${CHANGE}"]`).click();
        cy.get(`[data-test="priority-selection-${PRIORITY}"]`).click();
        cy.get('[data-test="dialog-action-update"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Updated:`);
      });

      it('should allow updating a task with high priority', () => {
        // setup
        const CHANGE = 'medium';
        const PRIORITY = 'high';
        cy.intercept('PUT', '/api/tasks/**', {
          ...TASK,
          priority: PRIORITY
        }).as('updateTask');

        // action
        cy.get(`[data-test="priority-selection-${CHANGE}"]`).click();
        cy.get(`[data-test="priority-selection-${PRIORITY}"]`).click();
        cy.get('[data-test="dialog-action-update"]').click();

        // assert
        cy.get('simple-snack-bar').should('be.visible');
        cy.get('.mat-mdc-snack-bar-label').contains(`Updated:`);
      });
    });
  });

  describe('Task Delete', () => {
    beforeEach(() => {
      cy.visit('/');

      cy.window()
        .then((win) => {
          cy.log('CYPRESS:', (win as any));
          (win as any).NG_APP.STORE().task.list.set(GET_TASK_LIST);
          cy.get('[data-test="nav-recently_added"]').click();

          const PAGE_TITLE = 'Recently Added';

          cy.get('[data-test="page-title-recently_added"]').contains(PAGE_TITLE);
          cy.get('[data-test="list-container"]').should('be.visible');

          // add
          cy.get('[data-test="add-task-button"]')
            .click()
            .then(() => {
              cy.wait(100);

              cy.get('mat-dialog-container').should('be.visible');
              cy.get('[data-test="dialog-title"]').contains('Add a New Task');

              // setup
              cy.intercept('POST', '/api/tasks', TASK).as('createTask');

              // action
              cy.get('[data-test="task-title-input"]').click();
              cy.get('[data-test="task-title-input"]').type(TASK.title);
              cy.get('[data-test="task-description-input"]').type('task');
              cy.get('[data-test="dialog-action-add"]').click();

              // assert
              cy.get('simple-snack-bar').should('be.visible');
              cy.get('.mat-mdc-snack-bar-label').contains(`Added: ${TASK.title.slice(0, 20)}`);
              cy.get('[data-test="list-item"]').should('have.length', 8);
            });
        });

      cy.wait(100);
    });

    it('should be able to delete task from the list', () => {
      cy.intercept('DELETE', '/api/tasks/**', TASK).as('deleteTask');

      // alternative to hover
      cy.get('[data-test="list-show-buttons"]').first().click({ force: true });

      cy.get('[data-test="item-wrap"]')
        .first()
        .find('[data-test="list-btn-delete"]')
        .should('be.visible')
        .click()
        .then(() => {
          // assert
          cy.get('simple-snack-bar').should('be.visible');
          cy.get('.mat-mdc-snack-bar-label').contains(`Deleted:`);
        });
    });

    it('should be able to delete task from the view', () => {
      cy.intercept('DELETE', '/api/tasks/**', TASK).as('deleteTask');

      // alternative to hover
      cy.get('[data-test="list-show-buttons"]').first().click({ force: true });

      cy.get('[data-test="item-wrap"]')
        .first()
        .find('[data-test="list-btn-view"]')
        .should('be.visible')
        .click()
        .then(() => {
          cy.get('[data-test="dialog-title"]').contains('Task Detail');
          cy.get('[data-test="dialog-action-delete"]')
            .should('be.visible')
            .click()
            .then(() => {
              // assert
              cy.get('simple-snack-bar').should('be.visible');
              cy.get('.mat-mdc-snack-bar-label').contains(`Deleted:`);
            });
        });
    });
  });
});

// context('Visual', () => {

// });

// context('Behavior', () => {

// });
