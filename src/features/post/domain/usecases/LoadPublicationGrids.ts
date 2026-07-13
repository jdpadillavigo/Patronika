import mapInBatches from '../../../../core/domain/utils/MapInBatches';
import PatternUseCase from '../../../pattern/domain/usecases/PatternUseCase';
import type { Publication } from '../../data/networking/PublicationRemoteDataSource';

export default async function loadPublicationGrids(publications: Publication[]): Promise<Map<string, string>> {
    const missingIds = new Set<string>();
    for (const publication of publications) {
        const id = publication.patternId || publication.pattern?.id;
        if (id && !publication.imageUrl && !publication.pattern?.gridData) missingIds.add(id);
    }

    const grids = new Map<string, string>();
    await mapInBatches([...missingIds], async id => {
        const result = await PatternUseCase.getById(id);
        if (result.success && result.data.gridData) grids.set(id, result.data.gridData);
    });
    return grids;
}
