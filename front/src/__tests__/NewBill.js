/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBill from '../containers/NewBill'
import NewBillUI from "../views/NewBillUI.js"
import { localStorageMock } from '../__mocks__/localStorage'

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the NewBills should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })

    describe("When I upload a file", () => {
      test("The file extension isn't correct", () => {
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
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage
        })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')
  
        inputFile.addEventListener('change', handleChangeFile)

        fireEvent.change(inputFile, {
          target: {
            files: [new File(['image.gif'], 'image.gif', {type: 'image/gif'})]
          }
        })

        const error = screen.getByTestId('error-message')
        expect(error).toBeTruthy()
      })
    })
  })
})
