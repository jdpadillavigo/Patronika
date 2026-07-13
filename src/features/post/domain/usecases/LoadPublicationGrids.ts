import mapInBatches from '../../../../core/domain/utils/MapInBatches';
import PatternUseCase from '../../../pattern/domain/usecases/PatternUseCase';
import type { Publication } from '../../data/networking/PublicationRemoteDataSource';

export default async function loadPublicationGrids(publications: Publication[]): Promise<Map<string, string>> {
    const missingIds = new Set<string>();
    for (const publication of publications) {
        const id = publication.patternId || publication.pattern?.id;
        // También para publicaciones con foto: si la foto no carga, la tarjeta muestra el patrón.
        if (id && !publication.pattern?.gridData) missingIds.add(id);
    }

    const grids = new Map<string, string>();
    await mapInBatches([...missingIds], async id => {
        const result = await PatternUseCase.getById(id);
        if (result.success && result.data.gridData) grids.set(id, result.data.gridData);
    });
    return grids;
}
