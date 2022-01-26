/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import Router from '../app/Router';
import { ROUTES_PATH } from '../constants/routes';
import { bills } from "../fixtures/bills.js";
import BillsUI from "../views/BillsUI.js";
import { localStorageMock } from '../__mocks__/localStorage';

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock
      })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: "Employee"
        })
      )
      const pathname = ROUTES_PATH['Bills'];
      Object.defineProperty(window, 'location', { value: { hash: pathname } })
      document.body.innerHTML = '<div id="root"></div>'
      Router();
      expect(screen.getByTestId("icon-window").classList.contains('active-icon')).toBe(true)
    })
    
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Then, loading page should be rendered", () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
})
