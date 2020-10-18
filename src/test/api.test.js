
import Config from '../helpers/api/config';
import api from '../helpers/api';

test('can get a token'), async () => {
    expect.assertions(1);
    const data = api.token('5adf91274d777d68700b0ca1');
    expect(data).toEqual('h');
}