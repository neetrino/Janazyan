import { adminPartnerStoreAreasService } from './admin-partner-store-areas.service';
import { adminPartnerStoreRegionsService } from './admin-partner-store-regions.service';

export {
  buildLocaleNamesFromLabel,
  type LocaleNameInput,
} from './partner-store-hierarchy.helpers';

class AdminPartnerStoreHierarchyService {
  listRegionsAndAreas = async () => {
    const [regions, areas] = await Promise.all([
      adminPartnerStoreRegionsService.listRegions(),
      adminPartnerStoreAreasService.listAreas(),
    ]);
    return { regions, areas };
  };

  createRegion = adminPartnerStoreRegionsService.createRegion.bind(
    adminPartnerStoreRegionsService,
  );
  updateRegion = adminPartnerStoreRegionsService.updateRegion.bind(
    adminPartnerStoreRegionsService,
  );
  deleteRegion = adminPartnerStoreRegionsService.deleteRegion.bind(
    adminPartnerStoreRegionsService,
  );

  createArea = adminPartnerStoreAreasService.createArea.bind(adminPartnerStoreAreasService);
  updateArea = adminPartnerStoreAreasService.updateArea.bind(adminPartnerStoreAreasService);
  deleteArea = adminPartnerStoreAreasService.deleteArea.bind(adminPartnerStoreAreasService);
  assertRegionAreaLink = adminPartnerStoreAreasService.assertRegionAreaLink.bind(
    adminPartnerStoreAreasService,
  );
}

export const adminPartnerStoreHierarchyService = new AdminPartnerStoreHierarchyService();
