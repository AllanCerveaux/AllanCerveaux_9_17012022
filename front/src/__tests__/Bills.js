/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import Router from '../app/Router';
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import Bills from '../containers/Bills';
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

    describe("When i click on the New Bill button", () => {
      test("Then, it should be render New Bill Page", () => {
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock
        })
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            type: "Employee"
          })
        )

        const html = BillsUI({ data: [] })
        document.body.innerHTML = html

        const bills = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage
        })

        const handleClickNewBill = jest.fn(bills.handleClickNewBill)
        const newBillButton = screen.getByTestId("btn-new-bill")
        newBillButton.addEventListener('click', handleClickNewBill)
        fireEvent.click(newBillButton)
        
        expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
      })
    })

    describe("When i click on the icon eye", () => {
      test("A modal should open", () => {
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock
        })
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            type: "Employee"
          })
        )

        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const c_bills = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage
        })
        
        $.fn.modal = jest.fn();
        const eye = screen.getAllByTestId('icon-eye')[0]
        const handleClickIconEye = jest.fn(() => c_bills.handleClickIconEye(eye))
        eye.addEventListener('click', handleClickIconEye)
        fireEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = document.getElementById('modaleFile')
        expect(modale).toBeTruthy()
      })
    })
  })
  
  describe('When I am on Dashboard page but it is loading', () => {
    test("Then, loading page should be rendered", () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  
  describe('When I am on Dashboard page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      const html = BillsUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
})
