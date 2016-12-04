import {assert} from "chai";
import {IContextDefinition} from "mocha";

import * as SkypeHttp from "../../lib/connect";
import {Credentials} from "../../lib/interfaces/api/api";
import {Api} from "../../lib/api";

import testConfig from "../test-config";

const mainAccount: Credentials = testConfig.credentials;

describe("SkypeHttp", function(this: IContextDefinition) {
  this.timeout(20000); // 20 seconds

  it("should connect to the main account trough authentication", function() {
    return SkypeHttp.connect({credentials: mainAccount, verbose: testConfig.verbose})
      .then((api: Api) => {
        assert.equal(api.context.username, mainAccount.username);
      });
  });
});
