import { SharedCommonService } from './shared-common.service';

describe('SharedCommonService', () => {
    let sharedCommon: SharedCommonService;

    beforeEach(() => {
        sharedCommon = new SharedCommonService();
    });

    it('properties should be defined', () => {
        expect(sharedCommon.topBarDark).toBeDefined();
        expect(sharedCommon.currentSearchTerm).toBeDefined();
    });
});
