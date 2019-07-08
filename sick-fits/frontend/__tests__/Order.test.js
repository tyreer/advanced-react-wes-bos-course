import { mount } from "enzyme";
import Order, { SINGLE_ORDER_QUERY } from "../components/Order";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { fakeOrder } from "../lib/testUtils";
import { MockedProvider } from "react-apollo/test-utils";
import formatMoney from "../lib/formatMoney";

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: "ord123" } },
    result: {
      data: {
        order: fakeOrder()
      }
    }
  }
];

describe("<Order/>", () => {
  it("renders with proper data", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain("Loading...");
    await wait();
    wrapper.update();

    const total = wrapper.find('span[data-test="test"]');
    expect(total.text()).toEqual(formatMoney(40000));

    const parent = wrapper.find('div[data-parent="test"]');
    expect(toJSON(parent)).toMatchSnapshot();
  });
});
