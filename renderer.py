from rdkit import Chem
from rdkit.Chem import AllChem
import pandas as pd
import argparse
import json

def getData(smarts):

    mol = Chem.MolFromSmarts(smarts)

    if not mol:
        # print(smarts2)
        mol = AllChem.ReactionFromSmarts(smarts)
        if not mol:
            return {"mol":[], "bond":[]}
        else:


            mol_datas = []
            bond_datas = []

            ar = mol.GetReactants()
            ar.extend(mol.GetProducts())

            n = 0
            cl = "reactant"
            # print(len(mol.GetReactants()), len(mol.GetProducts()))
            for rmol in ar:
                
                if len(mol.GetReactants()) - len(mol.GetProducts()) == n:
                    cl = "product"

                mol_data = {"x_coord": [], "y_coord": [], "atom_label": [], \
                            "num_Hs": [], "charge": [], "atom_number": [], "mol_class": []}
                bond_data = {"atom1": [], "atom2": [], "bond_type": []}

                idx = Chem.rdDepictor.Compute2DCoords(rmol)

                for i,k in enumerate(rmol.GetConformer(idx).GetPositions()):
                    mol_data["x_coord"].append(k[0])
                    mol_data["y_coord"].append(k[1])
                    mol_data["atom_label"].append(rmol.GetAtomWithIdx(i).GetSymbol())
                    mol_data["num_Hs"].append(rmol.GetAtomWithIdx(i).GetSmarts())
                    mol_data["charge"].append(rmol.GetAtomWithIdx(i).GetFormalCharge())
                    mol_data["atom_number"].append(rmol.GetAtomWithIdx(i).GetAtomMapNum())
                    mol_data["mol_class"].append(cl)

                for i in rmol.GetBonds():
                    bond_data["atom1"].append(i.GetBeginAtomIdx())
                    bond_data["atom2"].append(i.GetEndAtomIdx())
                    bond_data["bond_type"].append(i.GetBondTypeAsDouble())

                mol_data_df = pd.DataFrame(mol_data)
                bond_data_df = pd.DataFrame(bond_data)

                mol_datas.append(mol_data_df.to_dict(orient='list'))
                bond_datas.append(bond_data_df.to_dict(orient='list'))
                n = n + 1
            return {"mol":mol_datas, "bond":bond_datas}
    else:

        idx = Chem.rdDepictor.Compute2DCoords(mol)

        mol_data = {"x_coord": [], "y_coord": [], "atom_label": [], \
                    "num_Hs": [], "charge": [], "atom_number": [], "mol_class": []}

        for i,k in enumerate(mol.GetConformer(idx).GetPositions()):
            mol_data["x_coord"].append(k[0])
            mol_data["y_coord"].append(k[1])
            mol_data["atom_label"].append(mol.GetAtomWithIdx(i).GetSymbol())
            mol_data["num_Hs"].append(mol.GetAtomWithIdx(i).GetSmarts())
            mol_data["charge"].append(mol.GetAtomWithIdx(i).GetFormalCharge())
            mol_data["atom_number"].append(mol.GetAtomWithIdx(i).GetAtomMapNum())
            mol_data["mol_class"].append("reactant")

        bond_data = {"atom1": [], "atom2": [], "bond_type": []}
        for i in mol.GetBonds():
            bond_data["atom1"].append(i.GetBeginAtomIdx())
            bond_data["atom2"].append(i.GetEndAtomIdx())
            bond_data["bond_type"].append(i.GetBondTypeAsDouble())

        mol_data_df = pd.DataFrame(mol_data)
        bond_data_df = pd.DataFrame(bond_data)

        return {"mol":[mol_data_df.to_dict(orient='list')], "bond":[bond_data_df.to_dict(orient='list')]}


def main(args):
    if args.smarts:
        print(json.dumps(getData(args.smarts)))
    else:
        print("invalid smarts")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process command-line flags and arguments.")
    # parser.add_argument("-r", action="store_true", help="Activate reaction smarts mode.")
    # parser.add_argument("-m", action="store_true", help="Keep atom mapping.")
    parser.add_argument("smarts", nargs="?", help="Input smarts.")
    
    args = parser.parse_args()
    main(args)